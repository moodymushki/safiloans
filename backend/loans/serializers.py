from rest_framework import serializers

from .models import LoanApplication


class LoanApplicationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    fullName = serializers.CharField(source="full_name")
    idNumber = serializers.CharField(source="id_number")
    dateOfBirth = serializers.DateField(source="date_of_birth")
    jobTitle = serializers.CharField(source="job_title")
    monthlyIncome = serializers.DecimalField(source="monthly_income", max_digits=12, decimal_places=2)
    employmentDuration = serializers.CharField(source="employment_duration", allow_blank=True, required=False)
    loanAmount = serializers.DecimalField(source="loan_amount", max_digits=12, decimal_places=2)
    loanPurpose = serializers.CharField(source="loan_purpose")
    repaymentPeriod = serializers.IntegerField(source="repayment_period")
    processingFee = serializers.DecimalField(source="processing_fee", max_digits=12, decimal_places=2)
    mpesaNumber = serializers.CharField(source="mpesa_number")
    additionalInfo = serializers.CharField(source="additional_info", allow_blank=True, required=False)
    paidAt = serializers.DateTimeField(source="paid_at")
    submittedAt = serializers.DateTimeField(source="submitted_at", read_only=True)
    idDocument = serializers.FileField(source="id_document", allow_null=True, required=False)
    idFrontImage = serializers.ImageField(source="id_front_image", allow_null=True, required=False)
    idBackImage = serializers.ImageField(source="id_back_image", allow_null=True, required=False)
    idMergedImage = serializers.ImageField(source="id_merged_image", allow_null=True, required=False)
    paymentCheckoutId = serializers.CharField(source="payment_checkout_id")
    paymentReceipt = serializers.CharField(source="payment_receipt", required=False, allow_blank=True)

    class Meta:
        model = LoanApplication
        fields = [
            "id",
            "fullName",
            "email",
            "phone",
            "idNumber",
            "dateOfBirth",
            "address",
            "employer",
            "jobTitle",
            "monthlyIncome",
            "employmentDuration",
            "loanAmount",
            "loanPurpose",
            "repaymentPeriod",
            "processingFee",
            "mpesaNumber",
            "additionalInfo",
            "paidAt",
            "submittedAt",
            "idDocument",
            "idFrontImage",
            "idBackImage",
            "idMergedImage",
            "paymentCheckoutId",
            "paymentReceipt",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["idDocument"] = f"/api/applications/{instance.pk}/document/" if instance.id_document else None
        data["idFrontImage"] = f"/api/applications/{instance.pk}/image-front/" if instance.id_front_image else None
        data["idBackImage"] = f"/api/applications/{instance.pk}/image-back/" if instance.id_back_image else None
        data["idMergedImage"] = f"/api/applications/{instance.pk}/image-merged/" if instance.id_merged_image else None
        return data
