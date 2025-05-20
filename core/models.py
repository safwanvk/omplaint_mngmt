from django.db import models
from account.models import User

# Create your models here.
class Compilent(models.Model):
      options = (
        ('new','New'),
        ('triaged','Triaged'),
        ('in_progress','In progress'),
        ('resolved','Resolved'),
        ('closed','Closed')
      )
      title = models.CharField(max_length=250, null=True, blank=True)
      description = models.CharField(max_length=250, null=True, blank=True)
      assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
      createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)
      updatedAt = models.DateTimeField(auto_now=True)
      status = models.CharField(max_length=20, choices=options, blank=True, null=True, default='new')
      status_update_date = models.DateTimeField(null=True, blank=True)
      status_update_ip = models.CharField(blank=True, null=True, max_length=120)
      status_remark = models.CharField(max_length=250, null=True, blank=True)

      def __str__(self):
            return self.title