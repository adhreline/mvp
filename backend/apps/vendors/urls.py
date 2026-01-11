from django.urls import path
from .views import VendorSignupView, VendorSigninView, VendorMeView, VendorDocumentUploadView
from apps.activities.views import VendorActivitiesList

app_name = "vendors"

urlpatterns = [
    path('signup', VendorSignupView.as_view(), name='vendor-signup'),
    path('signin', VendorSigninView.as_view(), name='vendor-signin'),
    path('me', VendorMeView.as_view(), name='vendor-me'),
    path('me/documents', VendorDocumentUploadView.as_view(), name='vendor-documents'),
    path('<int:vendor_pk>/activities/', VendorActivitiesList.as_view(), name='vendor-activities'),
]
