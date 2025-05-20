from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework import status
from .serializers import UserProfileSerializer, RegisterSerializer
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from django.utils.translation import ngettext  as _
from .models import User
from django.db.models import Q
import  compilent_mngmt.exceptions as ApiExceptions
from compilent_mngmt.utils import apiSuccess
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import logout
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import login
from dal import autocomplete
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from core.models import Compilent
from rest_framework_simplejwt.authentication import JWTAuthentication

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
@authentication_classes([JWTAuthentication])
def authUser(request):
      if request.method == "GET":
            user = request.user
            userserializer = UserProfileSerializer(user)
            return JsonResponse(userserializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes((IsAuthenticated, IsAdminUser))
@authentication_classes([JWTAuthentication])
def registration(request):
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            raise APIException(serializer.errors , status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({'detail':'Registration success.'}, status.HTTP_201_CREATED)


class UserHasPermission(APIView):
    """
            User permission view
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request, *args, **kwargs):
        try:
            resp = {}
            req_data = request.data
            codenames = req_data.get('codenames', [])
            for codename in codenames:
                    has_permission = request.user.has_perm(codename)
                    print(has_permission)
                    resp[codename] = has_permission
        except Exception as e:
            print(e)
            # apiErrorLog(request,e)
            raise ApiExceptions.InternalServerError(detail=_("User permission checking is failed."))

        return Response(apiSuccess(data=resp), status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        logout(request)
        return Response(status=status.HTTP_205_RESET_CONTENT)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Get user from serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        # Login the user (session-based)
        login(request, user)

        return response

class EmployeeAutocomplete(autocomplete.Select2QuerySetView):
        def get_queryset(self):
                qs = None

                if self.q:
                    qs = User.objects.filter(
                            Q(email__icontains=self.q)
                    ).values(
                            'email',
                            'id'
                    ).distinct()
                else:
                    qs = User.objects.none()
                return qs

        def get_result_label(self, result):
                return result.get('email')

        def get_result_value(self, result):
                return result.get('id')

class GetActivity(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def humanize_number(self, value):
            try:
                  value = int(value)
            except (TypeError, ValueError):
                  return value

            if value >= 1000000:
                  return f'{value // 1000000}M'
            elif value >= 1000:
                  return f'{value // 1000}K'
            return str(value)

    def calculate_change(self, today_count, prev_count):
            res = 0
            if prev_count == 0:
                  if today_count == 0:
                        res = 0
                  else:
                        res = (today_count / abs(today_count) * 100)
            else:
                  res = (today_count - prev_count) / abs(prev_count) * 100
            sign = '-' if res < 0 else '+' if res > 0 else ''
            mag = round(abs(res), 1)
            return f'{sign}{mag}%'

    def get(self, request, *args, **kwargs):
        try:

                activity_filter = self.request.query_params.get('activity_filter', 'today')
                activity_filter_val = {
                    'today': 'from yesterday',
                    'weekly': 'from last past week',
                    'monthly': 'from last past month',
                    'yearly': 'from last past year',
                }
                filter_val = activity_filter_val.get(activity_filter, 'from yesterday')

                now = timezone.now()
                if activity_filter == 'today':
                    start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
                    start_yesterday = start_today - timezone.timedelta(days=1)
                elif activity_filter == 'weekly':
                    current_day_of_week = now.weekday()
                    start_today = now - timezone.timedelta(days=current_day_of_week + 1)
                    start_today = start_today.replace(hour=0, minute=0, second=0, microsecond=0)
                    start_yesterday = start_today - timezone.timedelta(weeks=1)
                elif activity_filter == 'monthly':
                    start_today = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    start_yesterday = (start_today - timezone.timedelta(days=1)).replace(day=1)
                elif activity_filter == 'yearly':
                    start_today = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                    start_yesterday = start_today - relativedelta(years=1)

                user_today = User.objects.filter(~Q(is_staff=True), Q(createdAt__gte=start_today)).count()
                user_yesterday = User.objects.filter(~Q(is_staff=True), Q(createdAt__gte=start_yesterday, createdAt__lt=start_today)).count()
                user_change = self.calculate_change(user_today, user_yesterday)

                complaint_today = Compilent.objects.filter(createdAt__gte=start_today)
                if not request.user.is_staff:
                    complaint_today = complaint_today.filter(Q(assignee=request.user.id))
                complaint_today = complaint_today.count()
                complaint_yesterday = Compilent.objects.filter(createdAt__gte=start_yesterday, createdAt__lt=start_today)
                if not request.user.is_staff:
                    complaint_yesterday = complaint_yesterday.filter(Q(assignee=request.user.id))
                complaint_yesterday = complaint_yesterday.count()
                complaint_change = self.calculate_change(complaint_today, complaint_yesterday)
                
                complaint_new_today = Compilent.objects.filter(status='new', createdAt__gte=start_today)
                if not request.user.is_staff:
                        complaint_new_today = complaint_new_today.filter(Q(assignee=request.user.id))
                complaint_new_today = complaint_new_today.count()
                complaint_new_yesterday = Compilent.objects.filter(status='new', createdAt__gte=start_yesterday, createdAt__lt=start_today)
                if not request.user.is_staff:
                        complaint_new_yesterday = complaint_new_yesterday.filter(Q(assignee=request.user.id))
                complaint_new_yesterday = complaint_new_yesterday.count()
                complaint_new_change = self.calculate_change(complaint_new_today, complaint_new_yesterday)

                stats = {
                    'user': {
                            'today': self.humanize_number(user_today),
                            'change': user_change,
                            'text': filter_val
                    },
                    'complaint': {
                            'today': self.humanize_number(complaint_today),
                            'change': complaint_change,
                            'text': filter_val
                    },
                    'complaint_new': {
                            'today': self.humanize_number(complaint_new_today),
                            'change': complaint_new_change,
                            'text': filter_val
                    },
                }
                if not request.user.is_staff:
                    del stats['user']
                return Response(apiSuccess(data=stats), status=status.HTTP_200_OK)
        except Exception as e:
                    print(e)
                #     apiErrorLog(self.request, e)
                    raise ApiExceptions.InternalServerError()