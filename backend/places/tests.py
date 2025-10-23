from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Event, Hotel, Restaurant


class BaseAPITestCase(APITestCase):
    def assertListEndpoint(self, url_name: str, model_cls):
        response = self.client.get(reverse(url_name))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        if isinstance(data, dict) and "count" in data:
            count = data["count"]
        else:
            count = len(data)
        self.assertEqual(count, model_cls.objects.count())


class HotelAPITests(BaseAPITestCase):
    def setUp(self):
        Hotel.objects.create(
            name="Skyline Hotel",
            description="Modern rooms with city views",
            price_per_night=120,
            rating=4.5,
            city="Prishtina",
            country="Kosovë",
        )

    def test_list_hotels(self):
        self.assertListEndpoint("hotel-list", Hotel)

    def test_create_hotel(self):
        payload = {
            "name": "Harbor Hotel",
            "description": "Close to the river walk.",
            "price_per_night": "150.00",
            "rating": "4.20",
            "city": "Peja",
            "country": "Kosovë",
        }
        response = self.client.post(reverse("hotel-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Hotel.objects.count(), 2)


class RestaurantAPITests(BaseAPITestCase):
    def setUp(self):
        Restaurant.objects.create(
            name="Sunrise Diner",
            description="Breakfast classics",
            opening_hours="07:00-15:00",
            menu="Pancakes, Omelettes",
            rating=4.2,
            city="Prizren",
            country="Kosovë",
            category="restaurant",
        )

    def test_list_restaurants(self):
        self.assertListEndpoint("restaurant-list", Restaurant)


class EventAPITests(BaseAPITestCase):
    def setUp(self):
        Event.objects.create(
            name="City Jazz Night",
            description="Live music downtown",
            date="2025-05-20",
            location="Main Square",
            city="Mitrovica",
            country="Kosovë",
        )

    def test_list_events(self):
        self.assertListEndpoint("event-list", Event)
