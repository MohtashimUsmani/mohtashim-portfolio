"""
api/urls.py
===========
URL patterns for the portfolio API.
All prefixed with /api/ in core/urls.py
"""

from django.urls import path
from .views import (
    AboutView,
    SkillListView,
    ProjectListView,
    ExperienceListView,
    SocialLinkListView,
    ContactCreateView,
    ContactMessageListView,
)

urlpatterns = [
    # ── Public endpoints ──────────────────────────
    path('about/',      AboutView.as_view(),          name='about'),
    path('skills/',     SkillListView.as_view(),       name='skills'),
    path('projects/',   ProjectListView.as_view(),     name='projects'),
    path('experience/', ExperienceListView.as_view(),  name='experience'),
    path('social/',     SocialLinkListView.as_view(),  name='social'),
    path('contact/',    ContactCreateView.as_view(),   name='contact'),

    # ── Admin-only endpoints ──────────────────────
    path('messages/',   ContactMessageListView.as_view(), name='messages'),
]