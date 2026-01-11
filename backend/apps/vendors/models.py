from django.db import models
import uuid
from decimal import Decimal
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

phone_validator = RegexValidator(
        regex=r'^\+?[0-9\s\-\(\)]{7,20}$',
        message='Enter a valid phone number (digits, spaces, +, - or parentheses).'
    )


class Vendor(models.Model):
    email = models.EmailField(unique=True)
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    fname = models.CharField(max_length=255)
    lname = models.CharField(max_length=255)
    bname = models.CharField(max_length=255)
    baddress = models.CharField(max_length=255)
    bphone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[phone_validator],
        help_text='Business phone number in international or local format.'
    )
    bcategory = models.CharField(max_length=255)
    bdescription = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    trade_license = models.BooleanField(default=False)
    trade_license_link = models.CharField(max_length=500, blank=True, null=True, help_text='URL or file path to trade license document')
    pan_card = models.BooleanField(default=False)
    pan_card_link = models.CharField(max_length=500, blank=True, null=True, help_text='URL or file path to PAN card document')
    activity_documents = models.JSONField(default=list, blank=True)
    is_account_approved = models.BooleanField(db_column='isAccountApproved', default=False)
    is_confirmation_mail_sent = models.BooleanField(db_column='isConfirmationMailSent', default=False, help_text='Whether confirmation email has been sent to vendor')
    total_bookings = models.PositiveIntegerField(
        default=0,
        help_text='Total number of bookings for this vendor.'
    )
    total_revenue = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total revenue for this vendor in smallest currency units (decimal-aware)."
    )
    cancellation_policy = models.TextField(
        blank=True,
        default='',
        help_text='Vendor cancellation policy text.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    def __str__(self) -> str:
        return f"{self.bname} <{self.email}>"

    def clean(self):
        errors = {}
        if self.trade_license and not self.trade_license_link:
            errors['trade_license_link'] = 'trade_license_link is required when trade_license is True.'
        if self.pan_card and not self.pan_card_link:
            errors['pan_card_link'] = 'pan_card_link is required when pan_card is True.'

        if self.activity_documents is None:
            self.activity_documents = []
        elif not isinstance(self.activity_documents, list):
            errors['activity_documents'] = 'activity_documents must be a list of URL strings.'

        if errors:
            raise ValidationError(errors)



class VendorDocument(models.Model):
    vendor = models.ForeignKey('Vendor', on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='vendors/%Y/%m/%d/')
    label = models.CharField(max_length=100, blank=True, help_text='Optional label like "trade_license" or "pan_card" or "activity_document"')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Document {self.id} for {self.vendor.bname} ({self.label})"
