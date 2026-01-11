from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import AccessToken
from .models import Vendor


class VendorJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth:
            return None

        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        try:
            access = AccessToken(token)
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid or expired token')

        vendor_id = access.get('vendor_id')
        if not vendor_id:
            return None

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            raise exceptions.AuthenticationFailed('Vendor not found')

        # only return in vendor login
        return (vendor, None)
