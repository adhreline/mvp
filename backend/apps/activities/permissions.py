from rest_framework.permissions import BasePermission, SAFE_METHODS
from apps.vendors.permissions import VendorIsAuthenticated


class IsVendorOwnerOrReadOnly(BasePermission):
    """Allow read-only for any, but modifications only by the vendor owner.

    This permission expects `request.vendor` to be set by `VendorIsAuthenticated`.
    For unsafe methods, ensure that the authenticated vendor matches the object's vendor.
    """

    def has_permission(self, request, view):
        # Allow anyone to read; for write operations we require vendor authentication
        if request.method in SAFE_METHODS:
            return True
        # For create/update/delete, a valid vendor token must be present
        return VendorIsAuthenticated().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        # Safe methods already allowed
        if request.method in SAFE_METHODS:
            return True
        request_vendor = getattr(request, 'vendor', None)
        if request_vendor is None:
            return False
        return str(request_vendor.id) == str(getattr(obj, 'vendor_id', getattr(obj, 'vendor', None)))
