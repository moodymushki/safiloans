from django.urls import path

from .views import (
    AdminLoginView,
    AdminProfileView,
    DashboardMetricsView,
    HealthView,
    LoanApplicationListCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("applications/", LoanApplicationListCreateView.as_view(), name="applications"),
    path("dashboard/metrics/", DashboardMetricsView.as_view(), name="dashboard-metrics"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/profile/", AdminProfileView.as_view(), name="admin-profile"),
]
