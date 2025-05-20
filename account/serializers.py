from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserProfileSerializer(serializers.ModelSerializer):

      class Meta:
            model = User
            fields = ['pk', 'email',
                        'phone_number', 'createdAt', 'title', 'full_name', 'first_name', 'last_name']
      
      def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
      

class RegisterSerializer(serializers.ModelSerializer):
    
      password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
      confirmpswd = serializers.CharField(write_only=True, required=True)

      class Meta:
            model = User
            fields = ('first_name', 'last_name', 'email', 'password', 'confirmpswd', 'id', 'title', 'phone_number')
            extra_kwargs = {
                  'first_name': {'required': True},
                  'last_name': {'required': True},
                  'title': {'required': True},
                  'phone_number': {'required': True}
            }

      def validate(self, attrs):
            if attrs['password'] != attrs['confirmpswd']:
                  raise serializers.ValidationError({"password": "Password fields didn't match."})

            return attrs

      def create(self, validated_data):
            user = User.objects.create(
                  email = validated_data['email'],
                  first_name = validated_data['first_name'],
                  last_name = validated_data['last_name'],
                  phone_number = validated_data['phone_number'],
                  title = validated_data['title'],
            )

            user.set_password(validated_data['password'])
            user.save()
            return user


class UserUpdateSerializer(serializers.ModelSerializer):

      class Meta:
            model = User
            fields = ['pk', 'phone_number', 'title', 'first_name', 'last_name', 'email']
            extra_kwargs = {
                  'title': {'required': True},
                  'phone_number': {'required': True}
            }