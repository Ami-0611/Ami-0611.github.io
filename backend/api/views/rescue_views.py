from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId
from api.mongo import get_collection
from api.serializers import  RescueTypeSerializer

class RescueTypeListView(APIView):
    def get(self, request):
        collection = get_collection("rescue_types")
        types = [
            {"_id": str(doc["_id"]), "type": doc["type"]}
            for doc in collection.find()
        ]
        return Response(types)

    def post(self, request):
        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        rtype = serializer.validated_data["type"]

        collection = get_collection("rescue_types")
        if collection.find_one({"type": rtype}):
            return Response({"error": "Rescue type already exists"}, status=409)
        result = collection.insert_one({"type": rtype})
        return Response({"message": "Rescue type added", "id": str(result.inserted_id)}, status=201)

    def put(self, request):
        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        rescue_id = serializer.validated_data.get("_id")
        new_type = serializer.validated_data.get("type")
        if not rescue_id:
            return Response({"error": "_id is required"}, status=400)

        collection = get_collection("rescue_types")
        result = collection.update_one({"_id": ObjectId(rescue_id)}, {"$set": {"type": new_type}})
        if result.matched_count == 0:
            return Response({"error": "Rescue type not found"}, status=404)
        return Response({"message": "Rescue type updated"})

    def delete(self, request):
        rescue_id = request.data.get("_id")
        if not rescue_id:
            return Response({"error": "_id is required"}, status=400)

        collection = get_collection("rescue_types")
        result = collection.delete_one({"_id": ObjectId(rescue_id)})
        if result.deleted_count == 0:
            return Response({"error": "Rescue type not found"}, status=404)
        return Response({"message": "Rescue type deleted"})
