from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import Breed
from api.serializers import BreedSerializer

# --- BREEDS ---
class BreedListView(APIView):
    def get(self, request):
        breeds = Breed.objects.all()
        breeds_data = [{"_id": str(breed.id), "name": breed.name} for breed in breeds]
        return Response(breeds_data)

    def post(self, request):
        serializer = BreedSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        name = serializer.validated_data["name"]

        if Breed.objects.filter(name=name).count() > 0:
            return Response({"error": "Breed already exists"}, status=409)
        
        breed = Breed(name=name)
        breed.save()
        return Response({"message": "Breed added", "id": str(breed.id)}, status=201)

    def put(self, request, breed_id=None):
        # Handle both URL parameter and request body
        if not breed_id:
            breed_id = request.data.get("_id")
        
        if not breed_id:
            return Response({"error": "Breed ID is required"}, status=400)

        serializer = BreedSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        new_name = serializer.validated_data.get("name")
        if not new_name:
            return Response({"error": "Name is required"}, status=400)

        try:
            breed = Breed.objects.get(id=breed_id)
            breed.name = new_name
            breed.save()
            return Response({"message": "Breed updated", "id": str(breed.id), "name": breed.name})
        except Breed.DoesNotExist:
            return Response({"error": "Breed not found"}, status=404)

    def delete(self, request, breed_id=None):
        # Handle both URL parameter and request body
        if not breed_id:
            breed_id = request.data.get("_id")
        
        if not breed_id:
            return Response({"error": "Breed ID is required"}, status=400)

        try:
            breed = Breed.objects.get(id=breed_id)
            breed.delete()
            return Response({"message": "Breed deleted"})
        except Breed.DoesNotExist:
            return Response({"error": "Breed not found"}, status=404)
