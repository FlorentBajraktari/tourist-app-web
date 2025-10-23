from rest_framework import serializers

from .models import Event, Hotel, Restaurant


class LocationMixin:
    latitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6,
        required=False,
        allow_null=True,
    )
    longitude = serializers.DecimalField(
        max_digits=9,
        decimal_places=6,
        required=False,
        allow_null=True,
    )


class HotelSerializer(LocationMixin, serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = "__all__"


class RestaurantSerializer(LocationMixin, serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = "__all__"


class EventSerializer(LocationMixin, serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
