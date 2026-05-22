"""
serializers.py — Portfolio API
================================
DRF serializers that convert model instances to/from JSON.
Used by all API views.
"""

from rest_framework import serializers
from .models import (
    About, AboutStat,
    Skill,
    Project,
    Experience,
    ContactMessage,
    SocialLink,
)


# ──────────────────────────────────────────────────────────────
# ABOUT
# ──────────────────────────────────────────────────────────────

class AboutStatSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AboutStat
        fields = ['id', 'value', 'label', 'order']


class AboutSerializer(serializers.ModelSerializer):
    stats = AboutStatSerializer(many=True, read_only=True)

    class Meta:
        model  = About
        fields = [
            'id', 'name', 'role_line',
            'code_tags',
            'bio_paragraph_1', 'bio_paragraph_2', 'bio_paragraph_3',
            'location', 'email',
            'github_url', 'linkedin_url', 'twitter_url',
            'is_available', 'profile_image', 'resume_file',
            'stats', 'updated_at',
        ]


# ──────────────────────────────────────────────────────────────
# SKILLS
# ──────────────────────────────────────────────────────────────

class SkillSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
        source='get_category_display', read_only=True
    )

    class Meta:
        model  = Skill
        fields = [
            'id', 'name', 'category', 'category_display',
            'level', 'icon_name', 'color', 'description',
            'is_active', 'order',
        ]


# ──────────────────────────────────────────────────────────────
# PROJECTS
# ──────────────────────────────────────────────────────────────

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = [
            'id', 'number', 'title', 'description',
            'badge', 'accent', 'tech_stack',
            'github_url', 'live_url', 'thumbnail',
            'is_featured', 'is_active', 'order', 'created_at',
        ]


# ──────────────────────────────────────────────────────────────
# EXPERIENCE
# ──────────────────────────────────────────────────────────────

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Experience
        fields = [
            'id', 'year', 'title', 'organization',
            'description', 'tags', 'icon_name',
            'side', 'order', 'is_active',
        ]


# ──────────────────────────────────────────────────────────────
# CONTACT MESSAGE
# ──────────────────────────────────────────────────────────────

class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """
    Used for POST /api/contact/ — only accepts user-submitted fields.
    Server-side fields (is_read, is_replied, ip_address) are excluded.
    """
    class Meta:
        model  = ContactMessage
        fields = ['name', 'email', 'subject', 'message']

    def validate_message(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "Message must be at least 5 characters."
            )
        return value


class ContactMessageSerializer(serializers.ModelSerializer):
    """Full serializer used in admin-facing endpoints."""
    class Meta:
        model  = ContactMessage
        fields = [
            'id', 'name', 'email', 'subject', 'message',
            'is_read', 'is_replied', 'ip_address', 'created_at',
        ]
        read_only_fields = ['id', 'ip_address', 'created_at']


# ──────────────────────────────────────────────────────────────
# SOCIAL LINKS
# ──────────────────────────────────────────────────────────────

class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(
        source='get_platform_display', read_only=True
    )

    class Meta:
        model  = SocialLink
        fields = [
            'id', 'platform', 'platform_display',
            'label', 'url', 'handle', 'icon_name',
            'is_active', 'order',
        ]