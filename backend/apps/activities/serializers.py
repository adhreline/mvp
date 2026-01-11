from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id',
            'booking_id',
            'vendor',
            'activity_name',
            'activity_status',
            'activity_price',
            'activity_total_slots',
            'activity_booked_slots',
            'created_at',
            'updated_at',
        ]
        # vendor is read-only: set automatically from the authenticated vendor token
        read_only_fields = ['id', 'booking_id', 'vendor', 'created_at', 'updated_at']
