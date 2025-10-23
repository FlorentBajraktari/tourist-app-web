from rest_framework import filters, viewsets

from .models import Event, Hotel, Restaurant
from .serializers import EventSerializer, HotelSerializer, RestaurantSerializer


class BaseLocationViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "city", "country"]
    ordering_fields = ["name", "rating", "city", "country"]
    ordering = ["name"]


class HotelViewSet(BaseLocationViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


class RestaurantViewSet(BaseLocationViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class EventViewSet(BaseLocationViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    ordering_fields = BaseLocationViewSet.ordering_fields + ["date"]
