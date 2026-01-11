from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import exceptions
from .models import Vendor


class VendorIsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        auth = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth:
            return False

        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return False

        token = parts[1]
        try:
            access = AccessToken(token)
        except Exception as exc:
            raise exceptions.AuthenticationFailed('Invalid or expired token') from exc

        vendor_id = access.get('vendor_id')
        if not vendor_id:
            return False

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            raise exceptions.AuthenticationFailed('Vendor not found')

        request.vendor = vendor
        return True