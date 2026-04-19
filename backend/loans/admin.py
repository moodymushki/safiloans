from django.contrib import admin

from .models import AdminCredential, LoanApplication, PaymentTransaction


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "loan_amount", "processing_fee", "submitted_at")
    search_fields = ("full_name", "phone", "id_number", "mpesa_number")
    ordering = ("-submitted_at",)


@admin.register(AdminCredential)
class AdminCredentialAdmin(admin.ModelAdmin):
    list_display = ("username", "updated_at")


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ("checkout_request_id", "phone_number", "amount", "status", "mpesa_receipt", "updated_at")
    search_fields = ("checkout_request_id", "phone_number", "mpesa_receipt")
