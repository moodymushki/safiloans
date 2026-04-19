from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .emails import send_application_received_email
from .models import AdminCredential, LoanApplication
from .serializers import LoanApplicationSerializer


def _normalize_username(username: str) -> str:
    return "".join(username.split()).lower()


def _get_default_admin() -> AdminCredential:
    admin, _created = AdminCredential.objects.get_or_create(
        username="koechkipsang36@gmail.com",
        defaults={"password": "Ombogo1234."},
    )
    return admin


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class LoanApplicationListCreateView(APIView):
    def get(self, request):
        queryset = LoanApplication.objects.all()
        serializer = LoanApplicationSerializer(queryset, many=True)
        return Response(serializer.data)

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
            send_application_received_email(application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardMetricsView(APIView):
    def get(self, request):
        count = LoanApplication.objects.count()
        total_revenue = LoanApplication.objects.aggregate(total=Sum("processing_fee")).get("total") or Decimal("0")
        total_loan_amount = LoanApplication.objects.aggregate(total=Sum("loan_amount")).get("total") or Decimal("0")
        average_fee = (total_revenue / count) if count else Decimal("0")

        return Response(
            {
                "totalApplicants": count,
                "totalRevenue": total_revenue,
                "totalLoansRequested": total_loan_amount,
                "averageFeePerApplicant": average_fee,
            }
        )


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
        return Response({"message": "Profile updated.", "username": admin.username})
