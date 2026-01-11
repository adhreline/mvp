from rest_framework import viewsets, permissions, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import NotFound
from .models import Activity
from .serializers import ActivitySerializer
from .permissions import IsVendorOwnerOrReadOnly
from apps.vendors.permissions import VendorIsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class StandardResultsSetPagination(PageNumberPagination):
	page_size = 25
	page_size_query_param = 'page_size'
	max_page_size = 100


class ActivityViewSet(viewsets.ModelViewSet):
	# Exclude soft-deleted activities from default queryset
	queryset = Activity.objects.exclude(activity_status=Activity.DELETED).select_related('vendor')
	serializer_class = ActivitySerializer
	# Allow anyone to read, but only the vendor owner may create/update/delete
	permission_classes = [IsVendorOwnerOrReadOnly]
	pagination_class = StandardResultsSetPagination
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['activity_name', 'vendor__bname']
	ordering_fields = ['created_at', 'activity_price', 'activity_status']
	ordering = ['-created_at']

	def perform_create(self, serializer):
		# Set the vendor from the authenticated vendor token (request.vendor)
		request_vendor = getattr(self.request, 'vendor', None)
		if request_vendor is None:
			# This will be handled by the permission class, but guard here too
			raise permissions.PermissionDenied('Vendor authentication required')
		serializer.save(vendor=request_vendor)

	def perform_destroy(self, instance):
		"""Soft-delete: mark activity as deleted instead of removing DB row."""
		instance.activity_status = Activity.DELETED
		instance.save()



class VendorActivitiesList(ListAPIView):
	serializer_class = ActivitySerializer
	pagination_class = StandardResultsSetPagination
	# Only the authenticated vendor who owns the vendor_pk may access
	permission_classes = [VendorIsAuthenticated]

	def get_queryset(self):
		vendor_pk = self.kwargs.get('vendor_pk')
		if not vendor_pk:
			raise NotFound('vendor_pk is required in URL')

		# Ensure the token-authenticated vendor matches the requested vendor
		request_vendor = getattr(self.request, 'vendor', None)
		if request_vendor is None or str(request_vendor.id) != str(vendor_pk):
			raise PermissionDenied('You do not have permission to access activities for this vendor')

		return Activity.objects.filter(vendor_id=vendor_pk).exclude(activity_status=Activity.DELETED).order_by('-created_at')



class ActivityByBookingIdDetail(RetrieveUpdateDestroyAPIView):
	"""Retrieve, update or delete an Activity by its booking_id (UUID).

	Permissions: only the owning vendor (via VendorIsAuthenticated) may update/delete.
	"""
	# Exclude soft-deleted activities so deleted ones return 404
	queryset = Activity.objects.exclude(activity_status=Activity.DELETED)
	serializer_class = ActivitySerializer
	lookup_field = 'booking_id'
	permission_classes = [IsVendorOwnerOrReadOnly]

	def get_object(self):
		# Delegate to DRF lookup but enforce vendor ownership in object permission
		obj = super().get_object()
		# For unsafe methods, IsVendorOwnerOrReadOnly.has_object_permission will be called by DRF
		return obj

	def perform_destroy(self, instance):
		instance.activity_status = Activity.DELETED
		instance.save()
