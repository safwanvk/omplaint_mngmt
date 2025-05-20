
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework import status
from account.serializers import UserProfileSerializer, UserUpdateSerializer
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from account.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from .serializers import CompilentSerializer, CompilentListSerializer, CompilentUpdateSerializer, CompilentWorkflowUpdateSerializer
from .models import Compilent
from compilent_mngmt.paginations import StandardResultsSetPagination
from rest_framework.views import APIView
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.db.models import Count
from compilent_mngmt.utils import apiSuccess
import compilent_mngmt.exceptions as ApiExceptions
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
class EmployeeList(generics.ListCreateAPIView):
      queryset = User.objects.filter(is_active=True, is_staff=False)
      serializer_class = UserProfileSerializer
      permission_classes = [IsAdminUser, IsAuthenticated]
      authentication_classes = [JWTAuthentication]
      pagination_class = StandardResultsSetPagination

      def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(~Q(id=request.user.id))

        # ✅ Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Fallback (not paginated)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class EmployeeRetrieveView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()
    lookup_field = 'id'

class EmployeeUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()
    lookup_field = 'id'

@api_view(['POST'])
@permission_classes((IsAuthenticated, IsAdminUser))
@permission_classes([JWTAuthentication])
def compilent_registration(request):
      if request.method == "POST":
            serializer = CompilentSerializer(data=request.data)
            if not serializer.is_valid():
                  raise APIException(serializer.errors , status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response({'detail':'Compilent registration success.'}, status.HTTP_201_CREATED)

class CompilentList(generics.ListCreateAPIView):
      queryset = Compilent.objects.all()
      serializer_class = CompilentListSerializer
      permission_classes = [IsAuthenticated]
      authentication_classes = [JWTAuthentication]
      pagination_class = StandardResultsSetPagination

      def list(self, request):
            queryset = self.get_queryset()
            if not request.user.is_staff:
                  queryset = queryset.filter(Q(assignee_id=request.user.id))
            page = self.paginate_queryset(queryset)
            if page is not None:
                  serializer = self.get_serializer(page, many=True)
                  return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

class CompilentRetrieveView(generics.RetrieveAPIView):
    serializer_class = CompilentListSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Compilent.objects.all()
    lookup_field = 'id'

class CompilentUpdateView(generics.UpdateAPIView):
    serializer_class = CompilentUpdateSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Compilent.objects.all()
    lookup_field = 'id'

class CompilentWorkflowUpdateView(generics.UpdateAPIView):
    serializer_class = CompilentWorkflowUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Compilent.objects.all()
    lookup_field = 'id'

class GetSource(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
            try:
                  now = timezone.now()
                  know_igl_activity_filter = self.request.query_params.get('know_igl_activity_filter', 'today')
                  if know_igl_activity_filter == 'today':
                        start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
                  elif know_igl_activity_filter == 'weekly':
                        current_day_of_week = now.weekday()
                        start_today = now - timezone.timedelta(days=current_day_of_week + 1)
                        start_today = start_today.replace(hour=0, minute=0, second=0, microsecond=0)
                  elif know_igl_activity_filter == 'monthly':
                        start_today = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                  elif know_igl_activity_filter == 'yearly':
                        start_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
                        start_today = start_today - relativedelta(years=1) + timezone.timedelta(days=1)
                  status_display_map = dict(Compilent.options)
                  status_mapping = {display: 0 for display in status_display_map.values()}
                  status_counts = (
                        Compilent.objects
                        .filter(createdAt__gte=start_today)
                        .values('status')
                        .annotate(count=Count('status'))
                        )
                  if not request.user.is_staff:
                        status_counts = status_counts.filter(Q(assignee=request.user.id))
                  for item in status_counts:
                        display_value = status_display_map.get(item['status'], 'Unknown')
                        status_mapping[display_value] = item['count']
                  return Response(apiSuccess(data=status_mapping), status=status.HTTP_200_OK)
            except Exception as e:
                  print(e)
                  #     apiErrorLog(self.request, e)
                  raise ApiExceptions.InternalServerError()