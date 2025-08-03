from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import Dog
from api.serializers import DogSerializer

class DogListView(APIView):
    def get(self, request):
        dogs = Dog.objects.all()
        dogs_data = []
        for dog in dogs:
            dog_dict = {
                "_id": str(dog.id),
                "animal_id": dog.animal_id,
                "animal_type": dog.animal_type,
                "breed": dog.breed.name if dog.breed else None,
                "color": dog.color,
                "date_of_birth": dog.date_of_birth,
                "datetime": dog.datetime,
                "name": dog.name,
                "outcome_subtype": dog.outcome_subtype,
                "outcome_type": dog.outcome_type,
                "sex_upon_outcome": dog.sex_upon_outcome,
                "location_lat": dog.location_lat,
                "location_long": dog.location_long,
                "age_upon_outcome_in_weeks": dog.age_upon_outcome_in_weeks,
                "rescue_type": dog.rescue_type.name if dog.rescue_type else None,
                "age": dog.age,
                "weight": dog.weight,
                "description": dog.description,
                "status": dog.status
            }
            dogs_data.append(dog_dict)
        print(f"dogs count: {len(dogs_data)}")
        return Response(dogs_data)

    def post(self, request):
        serializer = DogSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        
        # Check if dog with this animal_id already exists
        if Dog.objects.filter(animal_id=data["animal_id"]).exists():
            return Response({"error": "Dog with this animal_id already exists."}, status=409)

        # Create new dog using MongoEngine model
        dog = Dog(**data)
        dog.save()
        
        return Response({"message": "Dog added", "id": str(dog.id)}, status=201)

    def put(self, request):
        data = request.data
        _id = data.get("_id")
        if not _id:
            return Response({"error": "_id is required"}, status=400)

        serializer = DogSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            dog = Dog.objects.get(id=_id)
            for field, value in serializer.validated_data.items():
                setattr(dog, field, value)
            dog.save()
            return Response({"message": "Dog updated"})
        except Dog.DoesNotExist:
            return Response({"error": "Dog not found"}, status=404)

    def delete(self, request):
        _id = request.data.get("_id")
        if not _id:
            return Response({"error": "_id is required"}, status=400)

        try:
            dog = Dog.objects.get(id=_id)
            dog.delete()
            return Response({"message": "Dog deleted"})
        except Dog.DoesNotExist:
            return Response({"error": "Dog not found"}, status=404)
