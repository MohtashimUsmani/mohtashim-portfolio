from django.test import TestCase

from .models import About, ContactMessage, Project, Skill, SocialLink


class ModelStrTests(TestCase):
    def test_about_str(self):
        about = About.objects.create(bio_paragraph_1="Intro")
        self.assertIn(about.name, str(about))

    def test_project_str(self):
        project = Project.objects.create(number="01", title="Portfolio", description="Site")
        self.assertIn(project.title, str(project))

    def test_skill_str(self):
        skill = Skill.objects.create(name="Django", category="backend", level=90)
        self.assertIn(skill.name, str(skill))

    def test_social_link_str(self):
        link = SocialLink.objects.create(platform="github", label="GitHub", url="https://github.com/user")
        self.assertIn("GitHub", str(link))

    def test_contact_message_str(self):
        message = ContactMessage.objects.create(
            name="Jane",
            email="jane@example.com",
            subject="Hello",
            message="Hi",
        )
        rendered = str(message)
        self.assertIn("Jane", rendered)
        self.assertIn("Hello", rendered)
