from django.contrib import admin, messages
from django.db import transaction
from django.core.mail import send_mail
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect

from .models import Vendor, VendorDocument


def send_approval_email(vendor):
	subject = "Your Adhreline vendor account has been approved"
	message = (
		f"Hi {vendor.fname},\n\n"
		f"Your Adhreline vendor account for '{vendor.bname}' has been approved by an administrator.\n\n"
		f"You can now log in at https://adhreline.com/login using your registered email ({vendor.email}) and the password you created during signup. "
		"If you ever need to reset your credentials, use the forgot-password option on the login page or reply to this email so our support team can help.\n\n"
		f"Thanks for partnering with Adhreline!\n"
		f"— The Adhreline Support Team"
	)
	try:
		send_mail(
			subject,
			message,
			None,  # uses DEFAULT_FROM_EMAIL
			[vendor.email],
			fail_silently=False,
		)
		return True, None
	except Exception as e:
		return False, str(e)


@admin.action(description="✅ Approve selected vendor accounts")
def approve_selected_vendors(modeladmin, request, queryset):
	to_update = queryset.filter(is_account_approved=False)
	updated_count = 0
	email_sent_count = 0

	with transaction.atomic():
		for vendor in to_update.select_for_update():
			vendor.is_account_approved = True
			
			success, error = send_approval_email(vendor)
			if success:
				vendor.is_confirmation_mail_sent = True
				email_sent_count += 1
			else:
				messages.warning(request, f"Vendor {vendor.email} approved but email failed: {error}")
			
			vendor.save(update_fields=["is_account_approved", "is_confirmation_mail_sent", "updated_at"])
			updated_count += 1

	if updated_count:
		messages.success(request, f"Approved {updated_count} vendor(s). Emails sent: {email_sent_count}")
	else:
		messages.info(request, "No vendors were updated (all were already approved).")


@admin.action(description="Revoke approval for selected vendors")
def revoke_approval(modeladmin, request, queryset):
	updated = queryset.filter(is_account_approved=True).update(is_account_approved=False)
	if updated:
		messages.success(request, f"Revoked approval for {updated} vendor(s).")
	else:
		messages.info(request, "No vendors were updated (all were already unapproved).")


@admin.action(description="📧 Send confirmation email to selected vendors")
def send_confirmation_emails(modeladmin, request, queryset):
	eligible = queryset.filter(is_account_approved=True, is_confirmation_mail_sent=False)
	sent_count = 0
	
	for vendor in eligible:
		success, error = send_approval_email(vendor)
		if success:
			vendor.is_confirmation_mail_sent = True
			vendor.save(update_fields=["is_confirmation_mail_sent", "updated_at"])
			sent_count += 1
		else:
			messages.warning(request, f"Failed to send email to {vendor.email}: {error}")
	
	if sent_count:
		messages.success(request, f"Sent confirmation email to {sent_count} vendor(s).")
	else:
		messages.info(request, "No emails sent (vendors either not approved or already notified).")


@admin.action(description="Resend confirmation email to all selected vendors")
def resend_confirmation_emails(modeladmin, request, queryset):
	eligible = queryset.filter(is_account_approved=True)
	sent_count = 0
	
	for vendor in eligible:
		success, error = send_approval_email(vendor)
		if success:
			vendor.is_confirmation_mail_sent = True
			vendor.save(update_fields=["is_confirmation_mail_sent", "updated_at"])
			sent_count += 1
		else:
			messages.warning(request, f"Failed to send email to {vendor.email}: {error}")
	
	if sent_count:
		messages.success(request, f"Resent confirmation email to {sent_count} vendor(s).")
	else:
		messages.warning(request, "No emails sent. Selected vendors must be approved first.")


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
	list_display = (
		"email",
		"bname",
		"approval_status",
		"email_status",
		"full_name",
		"total_bookings",
		"total_revenue",
		"created_at",
	)
	list_filter = ("is_account_approved", "is_confirmation_mail_sent", "bcategory", "created_at", "trade_license", "pan_card")
	search_fields = ("email", "bname", "fname", "lname", "bphone_number")
	actions = [approve_selected_vendors, send_confirmation_emails, resend_confirmation_emails, revoke_approval]
	readonly_fields = ("public_id", "created_at", "updated_at", "total_bookings", "total_revenue", "send_email_button")
	
	fieldsets = (
		('Account Status', {
			'fields': ('is_account_approved', 'is_confirmation_mail_sent', 'send_email_button', 'public_id', 'created_at', 'updated_at'),
			'description': 'Approve vendor account and send confirmation email'
		}),
		('Personal Information', {
			'fields': ('email', 'fname', 'lname', 'password')
		}),
		('Business Information', {
			'fields': ('bname', 'baddress', 'bphone_number', 'bcategory', 'bdescription')
		}),
		('Documents', {
			'fields': ('trade_license', 'trade_license_link', 'pan_card', 'pan_card_link', 'activity_documents')
		}),
		('Business Metrics', {
			'fields': ('total_bookings', 'total_revenue', 'cancellation_policy')
		}),
	)
	
	def approval_status(self, obj):
		if obj.is_account_approved:
			return format_html(
				'<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 3px;">Approved</span>'
			)
		else:
			return format_html(
				'<span style="color: white; background-color: red; padding: 3px 10px; border-radius: 3px;">Pending</span>'
			)
	approval_status.short_description = 'Status'
	
	def email_status(self, obj):
		if obj.is_confirmation_mail_sent:
			return format_html(
				'<span style="color: green;">Sent</span>'
			)
		else:
			return format_html(
				'<span style="color: gray;">Not Sent</span>'
			)
	email_status.short_description = 'Email'
	
	def send_email_button(self, obj):
		if obj.pk:  
			if obj.is_account_approved:
				if obj.is_confirmation_mail_sent:
					return format_html(
						'<a class="button" href="{}">Resend Email</a>',
						f'/admin/vendors/vendor/{obj.pk}/send-email/'
					)
				else:
					return format_html(
						'<a class="button" href="{}">Send Confirmation Email</a>',
						f'/admin/vendors/vendor/{obj.pk}/send-email/'
					)
			else:
				return format_html('<span style="color: gray;">Approve vendor first to send email</span>')
		return ""
	send_email_button.short_description = 'Send Email'
	
	def get_urls(self):
		urls = super().get_urls()
		custom_urls = [
			path(
				'<int:vendor_id>/send-email/',
				self.admin_site.admin_view(self.send_email_view),
				name='vendors_vendor_send_email',
			),
		]
		return custom_urls + urls
	
	def send_email_view(self, request, vendor_id):
		vendor = Vendor.objects.get(pk=vendor_id)
		
		if not vendor.is_account_approved:
			messages.error(request, "Cannot send email to unapproved vendor.")
			return redirect('admin:vendors_vendor_change', vendor_id)
		
		success, error = send_approval_email(vendor)
		if success:
			vendor.is_confirmation_mail_sent = True
			vendor.save(update_fields=["is_confirmation_mail_sent", "updated_at"])
			messages.success(request, f"Confirmation email sent to {vendor.email}")
		else:
			messages.error(request, f"Failed to send email: {error}")
		
		return redirect('admin:vendors_vendor_change', vendor_id)
	
	def full_name(self, obj):
		return f"{obj.fname} {obj.lname}"
	full_name.short_description = 'Vendor Name'
	ordering = ['is_account_approved', '-created_at']


@admin.register(VendorDocument)
class VendorDocumentAdmin(admin.ModelAdmin):
	list_display = ("vendor", "label", "uploaded_at")
	search_fields = ("vendor__email", "vendor__bname", "label")
	list_filter = ("uploaded_at",)

