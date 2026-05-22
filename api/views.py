"""
views.py — Portfolio API
=========================
All REST API views.

Public endpoints (no auth required):
  GET  /api/about/
  GET  /api/skills/
  GET  /api/projects/
  GET  /api/experience/
  GET  /api/social/
  POST /api/contact/

Admin-only endpoint (IsAdminUser):
  GET  /api/messages/
"""

from rest_framework                 import generics, status
from rest_framework.response        import Response
from rest_framework.permissions     import AllowAny, IsAdminUser
from rest_framework.views           import APIView

from .models import (
    About, Skill, Project, Experience,
    ContactMessage, SocialLink,
)
from .serializers import (
    AboutSerializer,
    SkillSerializer,
    ProjectSerializer,
    ExperienceSerializer,
    ContactMessageCreateSerializer,
    ContactMessageSerializer,
    SocialLinkSerializer,
)


# ──────────────────────────────────────────────────────────────
# ABOUT
# ──────────────────────────────────────────────────────────────

class AboutView(APIView):
    """
    GET /api/about/
    Returns the single About object with its nested stats.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # There should only be one About record; take the first.
        about = About.objects.prefetch_related('stats').first()
        if not about:
            return Response(
                {'detail': 'About information not configured yet.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AboutSerializer(about, context={'request': request})
        return Response(serializer.data)


# ──────────────────────────────────────────────────────────────
# SKILLS
# ──────────────────────────────────────────────────────────────

class SkillListView(generics.ListAPIView):
    """
    GET /api/skills/
    Returns all active skills, ordered by 'order' then name.
    Optionally filter by category: /api/skills/?category=ai_ml
    """
    serializer_class   = SkillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Skill.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


# ──────────────────────────────────────────────────────────────
# PROJECTS
# ──────────────────────────────────────────────────────────────

class ProjectListView(generics.ListAPIView):
    """
    GET /api/projects/
    Returns active projects.
    Optional filter: /api/projects/?featured=true
    """
    serializer_class   = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Project.objects.filter(is_active=True)
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            qs = qs.filter(is_featured=True)
        return qs


# ──────────────────────────────────────────────────────────────
# EXPERIENCE
# ──────────────────────────────────────────────────────────────

class ExperienceListView(generics.ListAPIView):
    """
    GET /api/experience/
    Returns active timeline items ordered by 'order'.
    """
    serializer_class   = ExperienceSerializer
    permission_classes = [AllowAny]
    queryset           = Experience.objects.filter(is_active=True)


# ──────────────────────────────────────────────────────────────
# SOCIAL LINKS
# ──────────────────────────────────────────────────────────────

class SocialLinkListView(generics.ListAPIView):
    """
    GET /api/social/
    Returns active social links ordered by 'order'.
    """
    serializer_class   = SocialLinkSerializer
    permission_classes = [AllowAny]
    queryset           = SocialLink.objects.filter(is_active=True)


# ──────────────────────────────────────────────────────────────
# CONTACT FORM
# ──────────────────────────────────────────────────────────────

class ContactCreateView(generics.CreateAPIView):
    """
    POST /api/contact/
    Saves a new contact message.
    Automatically captures the sender's IP address.
    """
    serializer_class   = ContactMessageCreateSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        # Capture IP (handles proxies via X-Forwarded-For)
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        serializer.save(ip_address=ip)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'message': 'Your message has been received. I will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )


# ──────────────────────────────────────────────────────────────
# MESSAGES INBOX (Admin only)
# ──────────────────────────────────────────────────────────────

class ContactMessageListView(generics.ListAPIView):
    """
    GET /api/messages/
    Protected — only Django admin/staff users can access.
    Returns all contact messages, newest first.
    """
    serializer_class   = ContactMessageSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = ContactMessage.objects.all()
        # Optional filter: /api/messages/?unread=true
        unread = self.request.query_params.get('unread')
        if unread and unread.lower() == 'true':
            qs = qs.filter(is_read=False)
        return qs