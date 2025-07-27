from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId
from api.mongo import get_collection
from api.serializers import BreedSerializer

# --- BREEDS ---
class BreedListView(APIView):
    def get(self, request):
        collection = get_collection("breeds")
        breeds = [
            {"_id": str(doc["_id"]), "name": doc["name"]}
            for doc in collection.find()
        ]
        return Response(breeds)

    def post(self, request):
        serializer = BreedSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        name = serializer.validated_data["name"]

        collection = get_collection("breeds")
        if collection.find_one({"name": name}):
            return Response({"error": "Breed already exists"}, status=409)
        result = collection.insert_one({"name": name})
        return Response({"message": "Breed added", "id": str(result.inserted_id)}, status=201)

    def put(self, request):
        serializer = BreedSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        breed_id = serializer.validated_data.get("_id")
        new_name = serializer.validated_data.get("name")
        if not breed_id:
            return Response({"error": "_id is required"}, status=400)

        collection = get_collection("breeds")
        result = collection.update_one({"_id": ObjectId(breed_id)}, {"$set": {"name": new_name}})
        if result.matched_count == 0:
            return Response({"error": "Breed not found"}, status=404)
        return Response({"message": "Breed updated"})

    def delete(self, request):
        breed_id = request.data.get("_id")
        if not breed_id:
            return Response({"error": "_id is required"}, status=400)

        collection = get_collection("breeds")
        result = collection.delete_one({"_id": ObjectId(breed_id)})
        if result.deleted_count == 0:
            return Response({"error": "Breed not found"}, status=404)
        return Response({"message": "Breed deleted"})
