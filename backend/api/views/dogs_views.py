from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import Dog
from bson import ObjectId

class DogListView(APIView):
    def get(self, request, dog_id=None):
        if dog_id:
            # Get specific dog by ID
            try:
                # Try to find by animal_id first
                dog = Dog.objects.get(animal_id=dog_id)
            except Dog.DoesNotExist:
                try:
                    # Try to find by MongoDB ObjectId
                    dog = Dog.objects.get(id=ObjectId(dog_id))
                except (Dog.DoesNotExist, ValueError):
                    return Response({"error": "Dog not found"}, status=404)
            
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
            return Response(dog_dict)
        else:
            # Get all dogs
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
        # Validate required fields manually
        if not request.data.get("animal_id"):
            return Response({"error": "animal_id is required"}, status=400)
        
        if not request.data.get("name"):
            return Response({"error": "name is required"}, status=400)

        # Check if dog with this animal_id already exists
        try:
            return Response({"error": "Dog with this animal_id already exists."}, status=409)
        except Dog.DoesNotExist:
            pass

        # Prepare data with defaults
        dog_data = {
            "animal_id": request.data["animal_id"],
            "name": request.data["name"],
            "animal_type": request.data.get("animal_type", "Dog"),
            "breed": request.data.get("breed", ""),
            "color": request.data.get("color", ""),
            "date_of_birth": request.data.get("date_of_birth", ""),
            "datetime": request.data.get("datetime", ""),
            "outcome_type": request.data.get("outcome_type", "Adoption"),
            "outcome_subtype": request.data.get("outcome_subtype", ""),
            "sex_upon_outcome": request.data.get("sex_upon_outcome", ""),
            "location_lat": float(request.data.get("location_lat", 0)),
            "location_long": float(request.data.get("location_long", 0)),
            "age_upon_outcome_in_weeks": float(request.data.get("age_upon_outcome_in_weeks", 0)),
            "rescue_type": request.data.get("rescue_type", ""),
            "description": request.data.get("description", ""),
        }

        # Create new dog using MongoEngine model
        dog = Dog(**dog_data)
        dog.save()
        
        return Response({"message": "Dog added", "id": str(dog.id)}, status=201)

    def put(self, request, dog_id=None):
        if not dog_id:
            return Response({"error": "Dog ID is required"}, status=400)

        data = request.data
        
        # Try to find dog by animal_id first, then by MongoDB ObjectId
        try:
            dog = Dog.objects.get(animal_id=dog_id)
        except Dog.DoesNotExist:
            try:
                dog = Dog.objects.get(id=ObjectId(dog_id))
            except (Dog.DoesNotExist, ValueError):
                return Response({"error": "Dog not found"}, status=404)

        # Update only the fields that are provided in the request
        updateable_fields = ['name', 'color', 'age_upon_outcome_in_weeks', 'sex_upon_outcome', 'date_of_birth']
        
        for field in updateable_fields:
            if field in data:
                setattr(dog, field, data[field])
        
        dog.save()
        
        return Response({
            "message": "Dog updated successfully",
            "id": str(dog.id),
            "animal_id": dog.animal_id
        })

    def delete(self, request, dog_id=None):
        if not dog_id:
            return Response({"error": "Dog ID is required"}, status=400)

        # Try to find dog by animal_id first, then by MongoDB ObjectId
        try:
            dog = Dog.objects.get(animal_id=dog_id)
        except Dog.DoesNotExist:
            try:
                dog = Dog.objects.get(id=ObjectId(dog_id))
            except (Dog.DoesNotExist, ValueError):
                return Response({"error": "Dog not found"}, status=404)

        dog.delete()
        return Response({"message": "Dog deleted successfully"})
