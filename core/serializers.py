from rest_framework import serializers
from core.models import Compilent
from account.models import User
from django.utils import timezone
from .utilities import get_client_ip

class CompilentSerializer(serializers.ModelSerializer):
    

      class Meta:
            model = Compilent
            fields = ('title', 'description', 'assignee')
            extra_kwargs = {
                  'title': {'required': True},
                  'description': {'required': True},
                  'assignee': {'required': True},
            }

      def validate(self, attrs):
            if not User.objects.filter(id=attrs['assignee'].id, is_staff=False).exists():
                  raise serializers.ValidationError({"assignee": "Assignee fields didn't match."})

            return attrs

      def create(self, validated_data):
            compilent = Compilent.objects.create(
                  title = validated_data['title'],
                  description = validated_data['description'],
                  assignee = validated_data['assignee'],
            )

            compilent.save()
            return compilent

class CompilentListSerializer(serializers.ModelSerializer):
      assignee_name = serializers.CharField(source='assignee.full_name', read_only=True)
      status_display = serializers.SerializerMethodField()
      assignee_label = serializers.CharField(source='assignee.email', read_only=True)
      createdAt = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
      updatedAt = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
      status_update_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)


      class Meta:
            model = Compilent
            fields = ['pk', 'title',
                        'description', 'createdAt', 'assignee_name', 'status_display', 'status_update_date', 'status_update_ip',
                        'assignee_label', 'assignee', 'updatedAt', 'status_remark', 'status']
      
      def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
      def get_status_display(self, obj):
            return obj.get_status_display()

class CompilentUpdateSerializer(serializers.ModelSerializer):

      class Meta:
            model = Compilent
            fields = ['pk', 'title', 'description', 'assignee']
            extra_kwargs = {
                  'title': {'required': True},
                  'description': {'required': True},
                  'assignee': {'required': True}
            }
      
      def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
      
      def validate(self, attrs):
            if not User.objects.filter(id=attrs['assignee'].id, is_staff=False).exists():
                  raise serializers.ValidationError({"assignee": "Assignee fields didn't match."})

            return attrs

class CompilentWorkflowUpdateSerializer(serializers.ModelSerializer):

      class Meta:
            model = Compilent
            fields = ['id', 'status', 'status_remark']
            extra_kwargs = {
                  'status': {'required': True},
            }

      def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
      
      def validate_status(self, value):
            allowed_statuses = [choice[0] for choice in Compilent.options]
            if value not in allowed_statuses:
                  raise serializers.ValidationError(f"Invalid status. Allowed values are: {allowed_statuses}")
            return value

      def validate(self, attrs):
            user = self.context['request'].user
            compilent_id = self.instance.id if self.instance else None
            if not Compilent.objects.filter(assignee_id=user.id, id=compilent_id).exists():
                  raise serializers.ValidationError({"id": "You dont have permission to operations"})

            return attrs
      
      def update(self, instance, validated_data):
            old_status = instance.status
            new_status = validated_data.get('status', old_status)

            if old_status != new_status:
                  instance.status_update_date = timezone.now()
                  instance.status_update_ip = get_client_ip(self.context['request'])
                  instance.status = new_status
                  instance.status_remark = validated_data.get('status_remark', instance.status_remark)

                  instance.save()
            return instance