# api/serializers.py

from rest_framework import serializers

class BreedSerializer(serializers.Serializer):
    _id = serializers.CharField(required=False)
    name = serializers.CharField(max_length=100)

class RescueTypeSerializer(serializers.Serializer):
    _id = serializers.CharField(required=False)
    name = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=100, required=False)  # For backward compatibility

class DogSerializer(serializers.Serializer):
    _id = serializers.CharField(required=False)
    animal_id = serializers.CharField(max_length=20)
    animal_type = serializers.CharField(max_length=30)
    breed = serializers.CharField(max_length=100)
    color = serializers.CharField(max_length=100)
    date_of_birth = serializers.DateField()
    datetime = serializers.DateTimeField()
    name = serializers.CharField(allow_blank=True, required=False)
    outcome_subtype = serializers.CharField(allow_blank=True, required=False)
    outcome_type = serializers.CharField()
    sex_upon_outcome = serializers.CharField()
    location_lat = serializers.FloatField(required=False)
    location_long = serializers.FloatField(required=False)
    age_upon_outcome_in_weeks = serializers.FloatField()
    rescue_type = serializers.CharField()
