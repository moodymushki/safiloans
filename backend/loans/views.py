import mimetypes
from pathlib import Path
from decimal import Decimal

from django.core.paginator import Paginator
from django.core.cache import cache
from django.db.models import Sum, Prefetch
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AdminCredential, LoanApplication
from .serializers import LoanApplicationSerializer
from .tasks import process_image_merge_async, send_email_async


def _normalize_username(username: str) -> str:
    return "".join(username.split()).lower()


def _get_default_admin() -> AdminCredential:
    """Get admin credentials with fast lookup (uses database indexes)."""
    # Try to get from cache first (30 minute cache)
    cache_key = "default_admin_id"
    admin_id = cache.get(cache_key)
    
    if admin_id:
        try:
            return AdminCredential.objects.get(id=admin_id)
        except AdminCredential.DoesNotExist:
            cache.delete(cache_key)
    
    # Fallback: Try to get by username using indexed field
    try:
        admin = AdminCredential.objects.get(username="koechkipsang36@gmail.com")
        cache.set(cache_key, admin.id, 1800)  # Cache for 30 minutes
        return admin
    except AdminCredential.DoesNotExist:
        # Create if doesn't exist
        admin, _created = AdminCredential.objects.get_or_create(
            username="koechkipsang36@gmail.com",
            defaults={"password": "Ombogo1234."},
        )
        cache.set(cache_key, admin.id, 1800)  # Cache for 30 minutes
        return admin


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class LoanApplicationListCreateView(APIView):
    def get(self, request):
        # Add pagination - load 50 items per page by default
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 50)
        
        try:
            page = int(page)
            page_size = min(int(page_size), 100)  # Cap at 100 to prevent abuse
        except (ValueError, TypeError):
            page = 1
            page_size = 50
        
        # Use database index for ordering - most recent first
        queryset = LoanApplication.objects.all().order_by('-submitted_at')
        paginator = Paginator(queryset, page_size)
        
        try:
            page_obj = paginator.page(page)
        except Exception:
            page_obj = paginator.page(1)
        
        serializer = LoanApplicationSerializer(page_obj.object_list, many=True)
        
        return Response({
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "page_size": page_size,
            "results": serializer.data
        })

    def post(self, request):
        checkout_id = str(request.data.get("paymentCheckoutId", "")).strip()
        transaction_code = "".join(str(request.data.get("paymentReceipt", "")).upper().split())
        if not checkout_id and transaction_code:
            checkout_id = f"MANUAL-{transaction_code}"
        if not checkout_id:
            return Response({"message": "Missing payment reference."}, status=status.HTTP_400_BAD_REQUEST)

        mutable_data = request.data.copy()
        if not transaction_code and checkout_id.upper().startswith("MANUAL-"):
            transaction_code = "".join(checkout_id[7:].upper().split())

        if not transaction_code or not transaction_code.isalnum() or not (6 <= len(transaction_code) <= 30):
            return Response({"message": "Invalid M-Pesa transaction code."}, status=status.HTTP_400_BAD_REQUEST)

        manual_checkout_id = f"MANUAL-{transaction_code}"
        if LoanApplication.objects.filter(payment_checkout_id__iexact=manual_checkout_id).exists():
            return Response({"message": "This transaction code has already been submitted."}, status=status.HTTP_400_BAD_REQUEST)
        if LoanApplication.objects.filter(payment_receipt__iexact=transaction_code).exists():
            return Response({"message": "This transaction code has already been submitted."}, status=status.HTTP_400_BAD_REQUEST)

        mutable_data["paymentCheckoutId"] = manual_checkout_id
        mutable_data["paymentReceipt"] = transaction_code
        mutable_data["mpesaNumber"] = str(request.data.get("mpesaNumber", "")).strip() or "Till 5378522"
        mutable_data["paidAt"] = timezone.now().isoformat()

        serializer = LoanApplicationSerializer(data=mutable_data)
        if serializer.is_valid():
            application = serializer.save()
            
            # Process image merging in background (non-blocking)
            if application.id_front_image and application.id_back_image:
                process_image_merge_async(application.id)
            
            # Send confirmation email in background (non-blocking)
            send_email_async(application.id)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoanApplicationDocumentView(APIView):
    def get(self, request, pk):
        application = get_object_or_404(LoanApplication, pk=pk)
        if not application.id_document:
            raise Http404("No ID document is attached to this application.")

        filename = Path(application.id_document.name).name
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        try:
            document = application.id_document.open("rb")
        except FileNotFoundError as exc:
            raise Http404("The uploaded ID document file is missing.") from exc

        return FileResponse(document, content_type=content_type, as_attachment=False, filename=filename)


class LoanApplicationImageFrontView(APIView):
    def get(self, request, pk):
        application = get_object_or_404(LoanApplication, pk=pk)
        if not application.id_front_image:
            raise Http404("No front ID image is attached to this application.")

        filename = Path(application.id_front_image.name).name
        content_type = mimetypes.guess_type(filename)[0] or "image/jpeg"
        try:
            image = application.id_front_image.open("rb")
        except FileNotFoundError as exc:
            raise Http404("The uploaded front ID image file is missing.") from exc

        return FileResponse(image, content_type=content_type, as_attachment=False, filename=filename)


class LoanApplicationImageBackView(APIView):
    def get(self, request, pk):
        application = get_object_or_404(LoanApplication, pk=pk)
        if not application.id_back_image:
            raise Http404("No back ID image is attached to this application.")

        filename = Path(application.id_back_image.name).name
        content_type = mimetypes.guess_type(filename)[0] or "image/jpeg"
        try:
            image = application.id_back_image.open("rb")
        except FileNotFoundError as exc:
            raise Http404("The uploaded back ID image file is missing.") from exc

        return FileResponse(image, content_type=content_type, as_attachment=False, filename=filename)


class LoanApplicationImageMergedView(APIView):
    def get(self, request, pk):
        application = get_object_or_404(LoanApplication, pk=pk)
        if not application.id_merged_image:
            raise Http404("No merged ID image is attached to this application.")

        filename = Path(application.id_merged_image.name).name
        content_type = mimetypes.guess_type(filename)[0] or "image/jpeg"
        try:
            image = application.id_merged_image.open("rb")
        except FileNotFoundError as exc:
            raise Http404("The uploaded merged ID image file is missing.") from exc

        return FileResponse(image, content_type=content_type, as_attachment=False, filename=filename)


class DashboardMetricsView(APIView):
    def get(self, request):
        # Try to get cached metrics (cache for 5 minutes)
        cache_key = "dashboard_metrics"
        metrics = cache.get(cache_key)
        
        if metrics is None:
            count = LoanApplication.objects.count()
            total_revenue = LoanApplication.objects.aggregate(total=Sum("processing_fee")).get("total") or Decimal("0")
            total_loan_amount = LoanApplication.objects.aggregate(total=Sum("loan_amount")).get("total") or Decimal("0")
            average_fee = (total_revenue / count) if count else Decimal("0")

            metrics = {
                "totalApplicants": count,
                "totalRevenue": total_revenue,
                "totalLoansRequested": total_loan_amount,
                "averageFeePerApplicant": average_fee,
            }
            # Cache for 5 minutes (300 seconds)
            cache.set(cache_key, metrics, 300)

        return Response(metrics)


class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = _normalize_username(str(request.data.get("username", "")))
        password = str(request.data.get("password", "")).strip()
        admin = _get_default_admin()

        if username == _normalize_username(admin.username) and password == admin.password:
            return Response({"authenticated": True, "username": admin.username})
        return Response({"authenticated": False, "message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


class AdminProfileView(APIView):
    def get(self, request):
        admin = _get_default_admin()
        return Response({"username": admin.username})

    def put(self, request):
        admin = _get_default_admin()
        username = str(request.data.get("username", "")).strip()
        password = str(request.data.get("password", "")).strip()

        if not username or not password:
            return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        admin.username = username
        admin.password = password
        admin.save(update_fields=["username", "password", "updated_at"])
        
        # Clear cache after updating admin credentials
        cache.delete("default_admin_id")
        
        return Response({"message": "Profile updated.", "username": admin.username})
