from django.urls import path

from .views import (
    AdminLoginView,
    AdminProfileView,
    DashboardMetricsView,
    HealthView,
    LoanApplicationDocumentView,
    LoanApplicationImageBackView,
    LoanApplicationImageFrontView,
    LoanApplicationImageMergedView,
    LoanApplicationListCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("applications/", LoanApplicationListCreateView.as_view(), name="applications"),
    path("applications/<int:pk>/document/", LoanApplicationDocumentView.as_view(), name="application-document"),
    path("applications/<int:pk>/image-front/", LoanApplicationImageFrontView.as_view(), name="application-image-front"),
    path("applications/<int:pk>/image-back/", LoanApplicationImageBackView.as_view(), name="application-image-back"),
    path("applications/<int:pk>/image-merged/", LoanApplicationImageMergedView.as_view(), name="application-image-merged"),
    path("dashboard/metrics/", DashboardMetricsView.as_view(), name="dashboard-metrics"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/profile/", AdminProfileView.as_view(), name="admin-profile"),
]
