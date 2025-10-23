from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path(
        "",
        TemplateView.as_view(
            template_name="landing.html",
            extra_context={
                "api_root": "/api/",
            },
        ),
        name="home",
    ),
    path("admin/", admin.site.urls),
    path("api/", include("backend.places.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="api-docs",
    ),
]
