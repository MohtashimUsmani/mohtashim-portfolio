"""
admin.py — Portfolio API
========================
Full CRUD admin panel for every portfolio section.
Accessible at /admin/ — log in with your superuser account.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import (
    About, AboutStat,
    Skill,
    Project,
    Experience,
    ContactMessage,
    SocialLink,
)

# ── Admin site branding ──────────────────────────────────────
admin.site.site_header  = "Mohtashim Usmani — Portfolio Admin"
admin.site.site_title   = "Portfolio Admin"
admin.site.index_title  = "Portfolio Management Dashboard"


# ──────────────────────────────────────────────────────────────
# ABOUT
# ──────────────────────────────────────────────────────────────

class AboutStatInline(admin.TabularInline):
    """
    Edit stat cards (3+ Years Experience, etc.) directly
    inside the About admin page.
    """
    model              = AboutStat
    extra              = 1
    fields             = ['value', 'label', 'order']
    ordering           = ['order']


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    inlines     = [AboutStatInline]
    list_display = ['name', 'email', 'is_available', 'updated_at']
    readonly_fields = ['updated_at', 'profile_image_preview']

    fieldsets = (
        ('👤 Identity', {
            'fields': ('name', 'role_line', 'email', 'is_available')
        }),
        ('🛰️ Hero Orbit Tags', {
            'fields': ('code_tags',),
            'description': 'Enter as a JSON array: ["django runserver", "npm run build"]',
        }),
        ('📝 Bio Paragraphs', {
            'fields': ('bio_paragraph_1', 'bio_paragraph_2', 'bio_paragraph_3'),
            'description': 'Each paragraph is shown separately in the About section.',
        }),
        ('📍 Location & Social', {
            'fields': ('location', 'github_url', 'linkedin_url', 'twitter_url'),
        }),
        ('📁 Files', {
            'fields': ('profile_image', 'profile_image_preview', 'resume_file'),
        }),
        ('🕒 Meta', {
            'fields': ('updated_at',),
            'classes': ('collapse',),
        }),
    )

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" style="height:80px;border-radius:50%;" />',
                obj.profile_image.url
            )
        return "No image uploaded"
    profile_image_preview.short_description = "Preview"


# ──────────────────────────────────────────────────────────────
# SKILLS
# ──────────────────────────────────────────────────────────────

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category_badge', 'level_bar', 'color_swatch', 'is_active', 'order']
    list_editable  = ['is_active', 'order']
    list_filter    = ['category', 'is_active']
    search_fields  = ['name', 'description']
    ordering       = ['order', 'name']

    fieldsets = (
        ('🔧 Skill Info', {
            'fields': ('name', 'category', 'description')
        }),
        ('📊 Display', {
            'fields': ('level', 'icon_name', 'color', 'order', 'is_active'),
        }),
    )

    def category_badge(self, obj):
        colors = {
            'language':  '#3776AB',
            'framework': '#092E20',
            'frontend':  '#61DAFB',
            'database':  '#336791',
            'ai_ml':     '#F89939',
            'data':      '#150458',
            'devops':    '#2496ED',
        }
        bg = colors.get(obj.category, '#555')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            bg, obj.get_category_display()
        )
    category_badge.short_description = "Category"

    def level_bar(self, obj):
        color = '#27AE60' if obj.level >= 85 else '#F39C12' if obj.level >= 60 else '#E74C3C'
        return format_html(
            '<div style="width:120px;background:#2a2a2a;border-radius:4px;overflow:hidden">'
            '<div style="width:{}%;background:{};height:10px;border-radius:4px"></div>'
            '</div> <small style="color:#888">{}%</small>',
            obj.level, color, obj.level
        )
    level_bar.short_description = "Proficiency"

    def color_swatch(self, obj):
        return format_html(
            '<div style="width:24px;height:24px;background:{};border-radius:4px;'
            'border:1px solid #555;display:inline-block" title="{}"></div>',
            obj.color, obj.color
        )
    color_swatch.short_description = "Color"


# ──────────────────────────────────────────────────────────────
# PROJECTS
# ──────────────────────────────────────────────────────────────

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display   = ['number', 'title', 'badge_display', 'tech_preview',
                      'has_github', 'has_demo', 'is_featured', 'is_active', 'order']
    list_editable  = ['is_featured', 'is_active', 'order']
    list_filter    = ['badge', 'is_featured', 'is_active']
    search_fields  = ['title', 'description']
    ordering       = ['order']
    readonly_fields = ['thumbnail_preview', 'created_at']

    fieldsets = (
        ('📋 Project Info', {
            'fields': ('number', 'title', 'description', 'badge', 'accent')
        }),
        ('🛠️ Tech Stack', {
            'fields': ('tech_stack',),
            'description': 'Enter as a JSON array: ["Python", "Django", "React"]',
        }),
        ('🔗 Links', {
            'fields': ('github_url', 'live_url'),
        }),
        ('🖼️ Media', {
            'fields': ('thumbnail', 'thumbnail_preview'),
        }),
        ('⚙️ Settings', {
            'fields': ('is_featured', 'is_active', 'order'),
        }),
        ('🕒 Meta', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )

    def badge_display(self, obj):
        badge_colors = {
            'Machine Learning': '#F89939',
            'Full Stack':       '#E040FB',
            'Web App':          '#00BCD4',
            'Analytics':        '#FFD600',
            'Data Science':     '#4CAF50',
        }
        color = badge_colors.get(obj.badge, '#9E9E9E')
        return format_html(
            '<span style="color:{};border:1px solid {};padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            color, color, obj.badge
        )
    badge_display.short_description = "Badge"

    def tech_preview(self, obj):
        tags = obj.tech_stack or []
        shown = tags[:3]
        extra = len(tags) - 3
        html  = ' '.join(
            f'<span style="background:#2a2a2a;color:#aaa;padding:1px 6px;border-radius:3px;font-size:11px">{t}</span>'
            for t in shown
        )
        if extra > 0:
            html += f' <span style="color:#777;font-size:11px">+{extra} more</span>'
        return mark_safe(html)
    tech_preview.short_description = "Tech Stack"

    def has_github(self, obj):
        if obj.github_url:
            return format_html('<span style="color:#27AE60;font-size:16px">✓</span>')
        return format_html('<span style="color:#E74C3C;font-size:16px">✗</span>')
    has_github.short_description = "GitHub"

    def has_demo(self, obj):
        if obj.live_url:
            return format_html('<span style="color:#27AE60;font-size:16px">✓</span>')
        return format_html('<span style="color:#E74C3C;font-size:16px">✗</span>')
    has_demo.short_description = "Demo"

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="max-height:120px;border-radius:6px;" />',
                obj.thumbnail.url
            )
        return "No thumbnail uploaded"
    thumbnail_preview.short_description = "Preview"


# ──────────────────────────────────────────────────────────────
# EXPERIENCE
# ──────────────────────────────────────────────────────────────

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display   = ['year', 'title', 'organization', 'side', 'tags_preview', 'is_active', 'order']
    list_editable  = ['side', 'is_active', 'order']
    list_filter    = ['side', 'is_active']
    search_fields  = ['title', 'organization', 'description']
    ordering       = ['order']

    fieldsets = (
        ('📅 Timeline Entry', {
            'fields': ('year', 'title', 'organization', 'description')
        }),
        ('🏷️ Tags & Display', {
            'fields': ('tags', 'icon_name', 'side', 'order', 'is_active'),
            'description': 'Tags as JSON array: ["Python","Django"]',
        }),
    )

    def tags_preview(self, obj):
        tags = obj.tags or []
        html = ' '.join(
            f'<span style="background:#1a1a2e;color:#7986CB;padding:1px 6px;border-radius:3px;font-size:11px">{t}</span>'
            for t in tags[:4]
        )
        return mark_safe(html) if html else '—'
    tags_preview.short_description = "Tags"


# ──────────────────────────────────────────────────────────────
# CONTACT MESSAGES
# ──────────────────────────────────────────────────────────────

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display   = ['read_indicator', 'name', 'email', 'subject_preview',
                      'created_at', 'is_read', 'is_replied']
    list_filter    = ['is_read', 'is_replied', 'created_at']
    search_fields  = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'ip_address', 'created_at']
    list_editable   = ['is_read', 'is_replied']
    ordering        = ['-created_at']
    date_hierarchy  = 'created_at'

    fieldsets = (
        ('📩 Message', {
            'fields': ('name', 'email', 'subject', 'message')
        }),
        ('⚙️ Status', {
            'fields': ('is_read', 'is_replied'),
        }),
        ('📊 Meta', {
            'fields': ('ip_address', 'created_at'),
            'classes': ('collapse',),
        }),
    )

    # Prevent creating fake messages from admin
    def has_add_permission(self, request):
        return False

    def read_indicator(self, obj):
        if not obj.is_read:
            return format_html(
                '<span style="display:inline-block;width:8px;height:8px;background:#E74C3C;'
                'border-radius:50%;box-shadow:0 0 6px #E74C3C;" title="Unread"></span>'
            )
        return format_html(
            '<span style="display:inline-block;width:8px;height:8px;background:#555;'
            'border-radius:50%;" title="Read"></span>'
        )
    read_indicator.short_description = ""

    def subject_preview(self, obj):
        return obj.subject[:60] + ('…' if len(obj.subject) > 60 else '')
    subject_preview.short_description = "Subject"

    # Auto-mark as read when opened
    def change_view(self, request, object_id, form_url='', extra_context=None):
        try:
            msg = ContactMessage.objects.get(pk=object_id)
            if not msg.is_read:
                msg.is_read = True
                msg.save(update_fields=['is_read'])
        except ContactMessage.DoesNotExist:
            pass
        return super().change_view(request, object_id, form_url, extra_context)


# ──────────────────────────────────────────────────────────────
# SOCIAL LINKS
# ──────────────────────────────────────────────────────────────

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display  = ['platform_icon', 'label', 'handle', 'url_preview', 'is_active', 'order']
    list_editable = ['is_active', 'order']
    list_filter   = ['platform', 'is_active']
    search_fields = ['label', 'handle', 'url']
    ordering      = ['order']

    fieldsets = (
        ('🔗 Social Link', {
            'fields': ('platform', 'label', 'url', 'handle', 'icon_name')
        }),
        ('⚙️ Settings', {
            'fields': ('is_active', 'order'),
        }),
    )

    def platform_icon(self, obj):
        icons = {
            'github':   '🐙',
            'linkedin': '💼',
            'twitter':  '🐦',
            'email':    '📧',
            'kaggle':   '📊',
            'medium':   '✍️',
        }
        icon = icons.get(obj.platform, '🔗')
        return format_html('{} {}', icon, obj.get_platform_display())
    platform_icon.short_description = "Platform"

    def url_preview(self, obj):
        short = obj.url[:50] + ('…' if len(obj.url) > 50 else '')
        return format_html('<a href="{}" target="_blank">{}</a>', obj.url, short)
    url_preview.short_description = "URL"