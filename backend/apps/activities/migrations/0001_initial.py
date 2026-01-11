# Generated manual initial migration for activities.Activity
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('vendors', '0002_alter_vendor_bphone_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('booking_id', models.UUIDField(default=uuid.uuid4, unique=True, editable=False)),
                ('activity_name', models.CharField(max_length=255)),
                ('activity_status', models.CharField(choices=[('active', 'Active'), ('paused', 'Paused'), ('deleted', 'Deleted')], default='active', max_length=10)),
                ('activity_price', models.DecimalField(default=0, max_digits=10, decimal_places=2)),
                ('activity_total_slots', models.PositiveIntegerField(default=0)),
                ('activity_booked_slots', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('vendor', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='activities', to='vendors.vendor')),
            ],
        ),
    ]
