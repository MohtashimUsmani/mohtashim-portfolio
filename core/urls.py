"""
core/urls.py
============
Root URL configuration.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # Django default admin
    path('admin/', admin.site.urls),

    # Portfolio REST API
    path('api/', include('api.urls')),

    # React build root
    path('', TemplateView.as_view(template_name='index.html')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)