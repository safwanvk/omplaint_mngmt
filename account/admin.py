from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from account.models import User

# Register your models here.
class UserAdmin(BaseUserAdmin):
      """Define admin model for custom User model with no username field."""

      fieldsets = None
      add_fieldsets = (
            (None, {
                  'classes': ('wide',),
                  'fields': ('email', 'password1', 'password2'),
            }),
      )
      list_display = ('email', 'first_name', 'last_name', 'is_staff')
      search_fields = ('email', 'first_name', 'last_name')
      ordering = ('email',)


# Register your models here.
admin.site.register(User, UserAdmin)