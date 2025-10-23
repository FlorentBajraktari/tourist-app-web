from django.contrib import admin

from .models import Event, Hotel, Restaurant


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ("name", "price_per_night", "rating")
    search_fields = ("name", "description")


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("name", "opening_hours", "rating")
    search_fields = ("name", "description")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "date", "location")
    search_fields = ("name", "description", "location")
    list_filter = ("date",)
