
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _



class CustomUserManager(BaseUserManager):
      """
      Custom user model manager where email is the unique identifiers
      for authentication instead of usernames.
      """
      def create_user(self, email, password, **extra_fields):
            """
            Create and save a User with the given email and password.
            """
            if not email:
                  raise ValueError(_('The Email must be set'))
            email = self.normalize_email(email)
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.save()
            return user

      def create_superuser(self, email, password, **extra_fields):
            """
            Create and save a SuperUser with the given email and password.
            """
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('is_active', True)

            if extra_fields.get('is_staff') is not True:
                  raise ValueError(_('Superuser must have is_staff=True.'))
            if extra_fields.get('is_superuser') is not True:
                  raise ValueError(_('Superuser must have is_superuser=True.'))
            return self.create_user(email, password, **extra_fields)

# Extended User
class User(AbstractUser):
      username = None
      email = models.EmailField(_('email address'), unique=True)
      phone_number = models.CharField(max_length=15, blank=True)
      status = models.SmallIntegerField(default=1, blank=True, null=True)
      createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)
      updatedAt = models.DateTimeField(auto_now=True)
      title = models.CharField(max_length=250, null=True, blank=True)

      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = []

      objects = CustomUserManager()

      def __str__(self):
            return self.email

      @property
      def full_name(self):
            return self.get_full_name()
