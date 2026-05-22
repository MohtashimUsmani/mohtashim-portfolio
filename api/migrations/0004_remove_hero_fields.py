from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_update_hero_fields"),
    ]

    # No-op: HeroSection model was removed from the current schema.
    operations = []

