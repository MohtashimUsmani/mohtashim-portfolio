from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_remove_hero_fields"),
    ]

    # No-op: HeroSection model was removed from the current schema.
    operations = []

