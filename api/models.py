"""
models.py — Portfolio API
=========================
All database models for the portfolio site.
Each section of the frontend has a corresponding model here
so you can manage everything from Django Admin.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ──────────────────────────────────────────────────────────────
# ABOUT / BIO
# ──────────────────────────────────────────────────────────────

class About(models.Model):
    """
    Singleton-style model (only one row should exist).
    Stores the personal bio shown in the About section.
    """
    name          = models.CharField(max_length=120, default="Mohtashim Usmani")
    role_line     = models.CharField(
        max_length=200,
        default="Data Scientist · Full Stack Developer · Python Developer",
        help_text="Shown under the name (e.g. in footer / hero sub-text)"
    )
    code_tags     = models.JSONField(
        default=list,
        blank=True,
        help_text='Hero orbit tags as a JSON array, e.g. ["django runserver", "npm run build"]'
    )
    bio_paragraph_1 = models.TextField(
        help_text="First bio paragraph in the About section"
    )
    bio_paragraph_2 = models.TextField(
        blank=True,
        help_text="Second bio paragraph (optional)"
    )
    bio_paragraph_3 = models.TextField(
        blank=True,
        help_text="Third bio paragraph (optional)"
    )
    location      = models.CharField(max_length=120, default="Available Globally · Remote First")
    email         = models.EmailField(default="mohtashim@email.com")
    github_url    = models.URLField(blank=True)
    linkedin_url  = models.URLField(blank=True)
    twitter_url   = models.URLField(blank=True)
    is_available  = models.BooleanField(
        default=True,
        help_text="Toggles the 'Available for hire' badge on the hero section"
    )
    profile_image = models.ImageField(
        upload_to='about/',
        blank=True,
        null=True,
        help_text="Profile / avatar photo"
    )
    resume_file   = models.FileField(
        upload_to='resume/',
        blank=True,
        null=True,
        help_text="Downloadable CV / resume"
    )
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "About"
        verbose_name_plural = "About"

    def __str__(self):
        return f"About — {self.name}"


class AboutStat(models.Model):
    """
    The four stat cards shown in the About section:
    e.g. '3+ Years Experience', '15+ Projects Built'
    """
    about  = models.ForeignKey(About, on_delete=models.CASCADE, related_name='stats')
    value  = models.CharField(max_length=20,  help_text="e.g. '3+', '15+'")
    label  = models.CharField(max_length=60,  help_text="e.g. 'Years Experience'")
    order  = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering            = ['order']
        verbose_name        = "Stat Card"
        verbose_name_plural = "Stat Cards"

    def __str__(self):
        return f"{self.value} {self.label}"


# ──────────────────────────────────────────────────────────────
# SKILLS
# ──────────────────────────────────────────────────────────────

class Skill(models.Model):
    """
    Each skill card shown in the Skills section.
    """
    CATEGORY_CHOICES = [
        ('language',   'Language'),
        ('framework',  'Framework'),
        ('frontend',   'Frontend'),
        ('database',   'Database'),
        ('ai_ml',      'AI / ML'),
        ('data',       'Data'),
        ('analytics',  'Analytics'),
        ('backend',    'Backend'),
        ('devops',     'DevOps'),
        ('other',      'Other'),
    ]

    name       = models.CharField(max_length=80)
    category   = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    level      = models.PositiveSmallIntegerField(
        default=80,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Proficiency 0–100"
    )
    icon_name  = models.CharField(
        max_length=80,
        blank=True,
        help_text="react-icons identifier, e.g. FaPython, SiDjango"
    )
    color      = models.CharField(
        max_length=20,
        default='#FF1744',
        help_text="Hex color for the icon glow, e.g. #3776AB"
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        help_text="One-line description shown on the card"
    )
    is_active  = models.BooleanField(default=True)
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering            = ['order', 'name']
        verbose_name        = "Skill"
        verbose_name_plural = "Skills"

    def __str__(self):
        return f"{self.name} ({self.get_category_display()}) — {self.level}%"


# ──────────────────────────────────────────────────────────────
# PROJECTS
# ──────────────────────────────────────────────────────────────

class Project(models.Model):
    """
    Featured project cards shown in the Projects section.
    """
    BADGE_CHOICES = [
        ('Machine Learning', 'Machine Learning'),
        ('Full Stack',       'Full Stack'),
        ('Web App',          'Web App'),
        ('Analytics',        'Analytics'),
        ('Data Science',     'Data Science'),
        ('API',              'API'),
        ('Mobile',           'Mobile'),
        ('Other',            'Other'),
    ]

    number      = models.CharField(
        max_length=4,
        help_text="Display number on card, e.g. '01', '02'"
    )
    title       = models.CharField(max_length=120)
    description = models.TextField(help_text="2–3 sentence project description")
    badge       = models.CharField(max_length=40, choices=BADGE_CHOICES, default='Web App')
    accent      = models.CharField(
        max_length=20,
        default='#FF1744',
        help_text="Card accent colour (hex)"
    )
    tech_stack  = models.JSONField(
        default=list,
        help_text='JSON array of tech tags, e.g. ["Python","Django","React"]'
    )
    github_url  = models.URLField(blank=True)
    live_url    = models.URLField(blank=True, help_text="Live demo URL")
    thumbnail   = models.ImageField(
        upload_to='projects/',
        blank=True,
        null=True
    )
    is_featured = models.BooleanField(default=True)
    is_active   = models.BooleanField(default=True)
    order       = models.PositiveSmallIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ['order', '-created_at']
        verbose_name        = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return f"{self.number} — {self.title}"


# ──────────────────────────────────────────────────────────────
# EXPERIENCE / TIMELINE
# ──────────────────────────────────────────────────────────────

class Experience(models.Model):
    """
    Vertical timeline items in the Experience section.
    """
    SIDE_CHOICES = [
        ('left',  'Left'),
        ('right', 'Right'),
    ]

    year        = models.CharField(max_length=10, help_text="e.g. '2022' or '2022–2023'")
    title       = models.CharField(max_length=120)
    organization = models.CharField(max_length=120, help_text="e.g. 'Self-Taught', 'Freelance'")
    description = models.TextField()
    tags        = models.JSONField(
        default=list,
        help_text='Tech/skill tags, e.g. ["Python","Django"]'
    )
    icon_name   = models.CharField(
        max_length=80,
        blank=True,
        help_text="react-icons identifier, e.g. FaCode, FaBrain"
    )
    side        = models.CharField(
        max_length=5,
        choices=SIDE_CHOICES,
        default='left',
        help_text="Which side of the timeline the card appears on"
    )
    order       = models.PositiveSmallIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering            = ['order']
        verbose_name        = "Experience"
        verbose_name_plural = "Experience Timeline"

    def __str__(self):
        return f"{self.year} — {self.title}"


# ──────────────────────────────────────────────────────────────
# CONTACT MESSAGES (Inbox)
# ──────────────────────────────────────────────────────────────

class ContactMessage(models.Model):
    """
    Every message submitted via the Contact form is saved here.
    Manage replies from Django Admin.
    """
    name       = models.CharField(max_length=120)
    email      = models.EmailField()
    subject    = models.CharField(max_length=200)
    message    = models.TextField()
    is_read    = models.BooleanField(
        default=False,
        help_text="Mark as read once you've seen it"
    )
    is_replied = models.BooleanField(
        default=False,
        help_text="Mark as replied after you respond"
    )
    ip_address = models.GenericIPAddressField(
        blank=True, null=True,
        help_text="Automatically captured on submission"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ['-created_at']
        verbose_name        = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        status = "✓" if self.is_read else "●"
        return f"{status} {self.name} — {self.subject[:50]}"


# ──────────────────────────────────────────────────────────────
# SOCIAL LINKS
# ──────────────────────────────────────────────────────────────

class SocialLink(models.Model):
    """
    Social media / contact links shown in Hero, Contact, and Footer.
    """
    PLATFORM_CHOICES = [
        ('github',   'GitHub'),
        ('linkedin', 'LinkedIn'),
        ('twitter',  'Twitter / X'),
        ('email',    'Email'),
        ('kaggle',   'Kaggle'),
        ('medium',   'Medium'),
        ('other',    'Other'),
    ]

    platform   = models.CharField(max_length=30, choices=PLATFORM_CHOICES)
    label      = models.CharField(max_length=60, help_text="Display label, e.g. 'GitHub'")
    url        = models.CharField(
        max_length=200,
        help_text="Full URL or 'mailto:' link"
    )
    handle     = models.CharField(
        max_length=120,
        blank=True,
        help_text="Username / handle shown in the UI, e.g. '@mohtashim_dev'"
    )
    icon_name  = models.CharField(
        max_length=80,
        blank=True,
        help_text="react-icons identifier"
    )
    is_active  = models.BooleanField(default=True)
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering            = ['order']
        verbose_name        = "Social Link"
        verbose_name_plural = "Social Links"

    def __str__(self):
        return f"{self.get_platform_display()} — {self.handle or self.url}"