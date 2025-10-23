from rest_framework.routers import DefaultRouter

from .views import EventViewSet, HotelViewSet, RestaurantViewSet

router = DefaultRouter()
router.register(r"hotels", HotelViewSet)
router.register(r"restaurants", RestaurantViewSet)
router.register(r"events", EventViewSet)

urlpatterns = router.urls
