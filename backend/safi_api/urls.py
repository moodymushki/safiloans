from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path

urlpatterns = [
    path(
        "",
        lambda request: JsonResponse(
            {
                "message": "Safi Loans backend is running.",
                "health": "/api/health/",
                "api_base": "/api/",
            }
        ),
    ),
    path('admin/', admin.site.urls),
    path('api/', include('loans.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
