from rest_framework import serializers
from .models import Vendor
from .models import VendorDocument
from django.contrib.auth.password_validation import validate_password
import phonenumbers


class VendorSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = Vendor
        fields = ("id", "public_id", "email", "fname", "lname", "bname", "baddress", "bphone_number", "bcategory", "bdescription", "password")
        read_only_fields = ("id", "public_id")

    def validate_bphone_number(self, value):
        if not value:
            raise serializers.ValidationError('bphone_number is required')

        if phonenumbers is None:
            return value

        try:
            parsed = phonenumbers.parse(value, None)
            if not phonenumbers.is_valid_number(parsed):
                raise serializers.ValidationError('Enter a valid phone number')
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError('Enter a valid phone number')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        vendor = Vendor(**validated_data)
        vendor.set_password(password)
        vendor.save()
        return vendor


class VendorSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = ("id", "public_id", "email", "fname", "lname", "bname", "baddress", "bphone_number", "bcategory", "bdescription", "trade_license", "trade_license_link", "pan_card", "pan_card_link", "activity_documents", "documents", "is_account_approved", "is_confirmation_mail_sent", "created_at", "updated_at")
        read_only_fields = ("id", "public_id", "is_account_approved", "is_confirmation_mail_sent", "created_at", "updated_at")

    def get_documents(self, obj):
        request = self.context.get('request')
        docs = obj.documents.all().order_by('-uploaded_at')
        return [
            {
                'id': d.id,
                'label': d.label,
                'url': request.build_absolute_uri(d.file.url) if request is not None else d.file.url,
                'uploaded_at': d.uploaded_at,
            }
            for d in docs
        ]


class VendorDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorDocument
        fields = ('id', 'vendor', 'file', 'label', 'uploaded_at')
        read_only_fields = ('id', 'uploaded_at')
