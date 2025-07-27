from rest_framework.views import APIView
from rest_framework.response import Response
from bson.objectid import ObjectId
from api.mongo import get_collection
from api.serializers import DogSerializer

class DogListView(APIView):
    def get(self, request):
        collection = get_collection("dogs")
        dogs = [
            {**doc, "_id": str(doc["_id"])} for doc in collection.find({"rescue_type": {"$exists": True}})
        ]
        return Response(dogs)

    def post(self, request):
        serializer = DogSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        collection = get_collection("dogs")
        data = serializer.validated_data

        if collection.find_one({"animal_id": data["animal_id"]}):
            return Response({"error": "Dog with this animal_id already exists."}, status=409)

        result = collection.insert_one(data)
        return Response({"message": "Dog added", "id": str(result.inserted_id)}, status=201)

    def put(self, request):
        data = request.data
        _id = data.get("_id")
        if not _id:
            return Response({"error": "_id is required"}, status=400)

        serializer = DogSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        collection = get_collection("dogs")
        result = collection.update_one({"_id": ObjectId(_id)}, {"$set": serializer.validated_data})

        if result.matched_count == 0:
            return Response({"error": "Dog not found"}, status=404)
        return Response({"message": "Dog updated"})

    def delete(self, request):
        _id = request.data.get("_id")
        if not _id:
            return Response({"error": "_id is required"}, status=400)

        collection = get_collection("dogs")
        result = collection.delete_one({"_id": ObjectId(_id)})

        if result.deleted_count == 0:
            return Response({"error": "Dog not found"}, status=404)
        return Response({"message": "Dog deleted"})
