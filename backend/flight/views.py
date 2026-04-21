from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FlightSerializer, ReservationSerializer, StaffFlightSerializer
from .models import Flight, Reservation
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .permissions import IsStafforReadOnly
from datetime import datetime, date
from django.db.models import Q

# Create your views here.
class FlightView(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    # permission_classes = (IsAdminUser,)
    permission_classes = (IsStafforReadOnly,)
    
    def get_serializer_class(self):
        serializer = super().get_serializer_class()
        if self.request.user.is_staff:
            return StaffFlightSerializer
        return serializer
    
    def get_queryset(self):
        now = datetime.now()
        current_time = now.time()
        today = date.today()
        queryset = super().get_queryset()
        
        if self.request.user.is_staff:
            return queryset
        
        # Non-staff users see only upcoming flights (future date or today-later time).
        return Flight.objects.filter(
            Q(date_of_departure__gt=today)
            | Q(date_of_departure=today, estimated_time_of_departure__gt=current_time)
        )


class ReservationView(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        mine = self.request.query_params.get("mine")
        mine_enabled = str(mine).lower() in {"1", "true", "yes", "y", "on"}

        if self.request.user.is_staff:
            if mine_enabled:
                return queryset.filter(user=self.request.user)
            return queryset
        return queryset.filter(user=self.request.user)
