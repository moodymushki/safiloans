from django.db import models


class LoanApplication(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=20)
    id_number = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    address = models.CharField(max_length=200, blank=True)
    employer = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    employment_duration = models.CharField(max_length=20, blank=True)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)
    loan_purpose = models.CharField(max_length=20)
    repayment_period = models.PositiveSmallIntegerField()
    processing_fee = models.DecimalField(max_digits=12, decimal_places=2)
    mpesa_number = models.CharField(max_length=20)
    additional_info = models.TextField(blank=True)
    paid_at = models.DateTimeField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    # Support both single PDF and individual image uploads (front/back)
    id_document = models.FileField(upload_to="id_documents/", blank=True, null=True)
    id_front_image = models.ImageField(upload_to="id_documents/", blank=True, null=True)
    id_back_image = models.ImageField(upload_to="id_documents/", blank=True, null=True)
    id_merged_image = models.ImageField(upload_to="id_documents/", blank=True, null=True)
    payment_checkout_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    payment_receipt = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self) -> str:
        return f"{self.full_name} - Ksh {self.loan_amount}"


class AdminCredential(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.username


class PaymentTransaction(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"

    checkout_request_id = models.CharField(max_length=100, unique=True)
    merchant_request_id = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20)
    receiver_number = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    result_code = models.IntegerField(null=True, blank=True)
    result_desc = models.TextField(blank=True)
    mpesa_receipt = models.CharField(max_length=100, blank=True)
    raw_callback = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.checkout_request_id} ({self.status})"
