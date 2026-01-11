from django.db import models
import uuid


class Activity(models.Model):
	booking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	vendor = models.ForeignKey(
		'vendors.Vendor',
		on_delete=models.CASCADE,
		related_name='activities'
	)
	activity_name = models.CharField(max_length=255)

	ACTIVE = 'active'
	PAUSED = 'paused'
	DELETED = 'deleted'
	STATUS_CHOICES = [
		(ACTIVE, 'Active'),
		(PAUSED, 'Paused'),
		(DELETED, 'Deleted'),
	]

	activity_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=ACTIVE)
	activity_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	activity_total_slots = models.PositiveIntegerField(default=0)
	activity_booked_slots = models.PositiveIntegerField(default=0)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.activity_name} ({self.vendor.bname})"