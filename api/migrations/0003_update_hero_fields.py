from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    # No-op: HeroSection model was removed from the current schema.
    operations = []
