from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, ActivityByBookingIdDetail

router = DefaultRouter()
router.register(r'', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
    # Access activity by booking_id (UUID) for retrieve/update/delete
    path('booking/<uuid:booking_id>/', ActivityByBookingIdDetail.as_view(), name='activity-by-booking-id'),
]
