from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


COUNTRY_CHOICES = [
    ("Kosovë", "Kosovë"),
    ("Shqipëri", "Shqipëri"),
]


class Hotel(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    city = models.CharField(max_length=120, default="Prishtina")
    country = models.CharField(max_length=40, choices=COUNTRY_CHOICES, default="Kosovë")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Restaurant(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    opening_hours = models.CharField(max_length=255)
    menu = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    city = models.CharField(max_length=120, default="Prishtina")
    country = models.CharField(max_length=40, choices=COUNTRY_CHOICES, default="Kosovë")
    category = models.CharField(
        max_length=30,
        choices=[
            ("restaurant", "Restaurant"),
            ("bar", "Bar"),
            ("cafe", "Cafe"),
            ("dessert", "Dessert"),
        ],
        default="restaurant",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Event(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=120, default="Prishtina")
    country = models.CharField(max_length=40, choices=COUNTRY_CHOICES, default="Kosovë")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.date})"
