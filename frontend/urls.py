
from django.urls import path
from .views import (Home, UserLoginView, AflDasboardView, ManageStaff, AddNewEmployee, AflManageMemberEdit, ManageComplaint,
                    AddNewComplaint, AflManageComplaintsEdit, ComplaintView, AflManageComplaintsWorkflow)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('login/', UserLoginView.as_view(), name='login_url'),
    path('dashboard/', AflDasboardView.as_view(), name='dashboard'),
    path('manage-staff/', ManageStaff.as_view(), name='manage_staff'),
    path('add-new-employee/', AddNewEmployee.as_view(), name='add_employee'),
    path('manage-employee/edit/', AflManageMemberEdit.as_view(), name="manage_members-edit"),
    path('manage-complaint/', ManageComplaint.as_view(), name='manage_complaint'),
    path('add-new-complaint/', AddNewComplaint.as_view(), name='add_complaint'),
    path('manage-complaint/edit/', AflManageComplaintsEdit.as_view(), name="manage_complaint-edit"),
    path('complaints/view/', ComplaintView.as_view(), name="complaint_view"),
    path('manage-complaint/workflow/', AflManageComplaintsWorkflow.as_view(), name="manage_complaint-workflow"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)