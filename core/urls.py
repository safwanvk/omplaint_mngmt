from django.contrib import admin
from django.urls import path, include
from .views import (EmployeeList, EmployeeRetrieveView, EmployeeUpdateView, compilent_registration, CompilentList, CompilentRetrieveView,
                    CompilentUpdateView, CompilentWorkflowUpdateView, GetSource)

urlpatterns = [
    path('employee/list/', EmployeeList.as_view(), name='employee_list'),
    path('employee/details/<id>/', EmployeeRetrieveView.as_view(), name='employee_details'),
    path('employee/details/<id>/update/', EmployeeUpdateView.as_view(), name='employee_update'),
    path('add-complaint/', compilent_registration, name='compilent_registration'),
    path('complaint/list/', CompilentList.as_view(), name='compilent_list'),
    path('complaint/details/<id>/', CompilentRetrieveView.as_view(), name='compilent_details'),
    path('complaint/details/<id>/update/', CompilentUpdateView.as_view(), name='compilent_update'),
    path('complaint/details/<id>/workflow/', CompilentWorkflowUpdateView.as_view(), name='compilent_update'),
    path('complaint/source/', GetSource.as_view(), name='api_order_get_source'),
]