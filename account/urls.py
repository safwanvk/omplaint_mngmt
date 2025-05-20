
from django.urls import re_path, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import authUser, registration, UserHasPermission, LogoutView, CustomTokenObtainPairView, EmployeeAutocomplete, GetActivity

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', authUser, name='auth_user'),
    path('register/', registration, name='user_registration'),
    path('check-permission/', UserHasPermission.as_view(), name='check-permission'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    re_path(r'^assignee-autocomplete/$',EmployeeAutocomplete.as_view(),name='employee-autocomplete'),
    path('activity/', GetActivity.as_view(), name='api_order_get_activity'),
]