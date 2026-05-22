from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0005_remove_hero_roles_actions"),
    ]

    # No-op: About and Skill models are part of the current schema.
    operations = []

