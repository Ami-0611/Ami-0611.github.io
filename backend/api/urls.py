# api/urls.py
from django.urls import path
from .views.rescue_views import RescueTypeListView
from .views.breed_views import BreedListView
from .views.dogs_views import DogListView

urlpatterns = [
    path("breeds/", BreedListView.as_view(), name="breed-list"),
    path("breeds/<str:breed_id>/", BreedListView.as_view(), name="breed-detail"),
    path("rescue-types/", RescueTypeListView.as_view(), name="rescue-type-list"),
    path("rescue-types/<str:rescue_id>/", RescueTypeListView.as_view(), name="rescue-type-detail"),
    path('dogs/', DogListView.as_view(), name='dog-list'),
    path('dogs/<str:dog_id>/', DogListView.as_view(), name='dog-detail'),
]
