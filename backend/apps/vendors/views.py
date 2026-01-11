from rest_framework import status
import traceback
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import VendorSignupSerializer, VendorSerializer
from .models import Vendor
from rest_framework.permissions import AllowAny

# Simple JWT imports
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import VendorIsAuthenticated
from .serializers import VendorDocumentSerializer
from .models import VendorDocument
from rest_framework.parsers import MultiPartParser, FormParser


class VendorMeView(APIView):
    permission_classes = (VendorIsAuthenticated,)

    def get(self, request):
        vendor = getattr(request, 'vendor', None)
        if not vendor:
            return Response({"detail": "Not authenticated as vendor"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(VendorSerializer(vendor).data)


class VendorSignupView(APIView):
    permission_classes = (AllowAny,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            
            serializer = VendorSignupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            vendor = serializer.save()

            
            created = []
            trade_file = request.FILES.get('trade_license_file')
            if trade_file:
                doc = VendorDocument.objects.create(vendor=vendor, file=trade_file, label='trade_license')
                vendor.trade_license = True
                vendor.trade_license_link = doc.file.url
                created.append(doc)

            pan_file = request.FILES.get('pan_card_file')
            if pan_file:
                doc = VendorDocument.objects.create(vendor=vendor, file=pan_file, label='pan_card')
                vendor.pan_card = True
                vendor.pan_card_link = doc.file.url
                created.append(doc)

            activity_files = request.FILES.getlist('activity_documents') if hasattr(request.FILES, 'getlist') else []
            for f in activity_files:
                doc = VendorDocument.objects.create(vendor=vendor, file=f, label='activity_document')
                vendor.activity_documents.append(doc.file.url)
                created.append(doc)

            
            trade_link = request.data.get('trade_license_link')
            pan_link = request.data.get('pan_card_link')
            trade_flag = request.data.get('trade_license')
            pan_flag = request.data.get('pan_card')
            def to_bool(val):
                if val is None:
                    return None
                if isinstance(val, bool):
                    return val
                return str(val).lower() in ('1', 'true', 'yes', 'on')

            if trade_link:
                vendor.trade_license_link = trade_link
            if pan_link:
                vendor.pan_card_link = pan_link
            if to_bool(trade_flag) is not None and not trade_file:
                vendor.trade_license = bool(to_bool(trade_flag))
            if to_bool(pan_flag) is not None and not pan_file:
                vendor.pan_card = bool(to_bool(pan_flag))

            vendor.save()

            data = VendorSerializer(vendor, context={'request': request}).data
            if created:
                docs = VendorDocumentSerializer(created, many=True, context={'request': request}).data
                data['documents'] = docs

            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            # Provide helpful debugging output when DEBUG=True
            tb = traceback.format_exc()
            if getattr(settings, 'DEBUG', False):
                return Response({
                    'detail': 'internal error during signup',
                    'error': str(exc),
                    'traceback': tb,
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({'detail': 'internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VendorSigninView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vendor = Vendor.objects.get(email=email)
        except Vendor.DoesNotExist:
            return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not vendor.check_password(password):
            return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(vendor)

        
        refresh['vendor_id'] = str(vendor.id)
        refresh['vendor_email'] = vendor.email
        refresh['vendor_name'] = vendor.bname

        access = refresh.access_token
        access['vendor_id'] = str(vendor.id)
        access['vendor_email'] = vendor.email
        access['vendor_name'] = vendor.bname

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "vendor": VendorSerializer(vendor).data,
        })


class VendorDocumentUploadView(APIView):
    permission_classes = (VendorIsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        vendor = getattr(request, 'vendor', None)
        if not vendor:
            return Response({"detail": "Not authenticated as vendor"}, status=status.HTTP_401_UNAUTHORIZED)

        trade_flag = request.data.get('trade_license')
        pan_flag = request.data.get('pan_card')

        def to_bool(val):
            if val is None:
                return None
            if isinstance(val, bool):
                return val
            return str(val).lower() in ('1', 'true', 'yes', 'on')

        trade_flag = to_bool(trade_flag)
        pan_flag = to_bool(pan_flag)

        
        created = []
        trade_file = request.FILES.get('trade_license_file')
        if trade_file:
            doc = VendorDocument.objects.create(vendor=vendor, file=trade_file, label='trade_license')
            vendor.trade_license = True
            vendor.trade_license_link = doc.file.url
            created.append(doc)

        pan_file = request.FILES.get('pan_card_file')
        if pan_file:
            doc = VendorDocument.objects.create(vendor=vendor, file=pan_file, label='pan_card')
            vendor.pan_card = True
            vendor.pan_card_link = doc.file.url
            created.append(doc)

        activity_files = request.FILES.getlist('activity_documents') if hasattr(request.FILES, 'getlist') else []
        for f in activity_files:
            doc = VendorDocument.objects.create(vendor=vendor, file=f, label='activity_document')
            vendor.activity_documents.append(doc.file.url)
            created.append(doc)

        if trade_flag is not None and not trade_file:
            vendor.trade_license = bool(trade_flag)
        if pan_flag is not None and not pan_file:
            vendor.pan_card = bool(pan_flag)

        trade_link = request.data.get('trade_license_link')
        pan_link = request.data.get('pan_card_link')
        if trade_link:
            vendor.trade_license_link = trade_link
        if pan_link:
            vendor.pan_card_link = pan_link

        vendor.save()

        serializer = VendorDocumentSerializer(created, many=True, context={'request': request})
        return Response({'documents': serializer.data, 'vendor': VendorSerializer(vendor, context={'request': request}).data}, status=status.HTTP_201_CREATED)
