from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import RescueType
from api.serializers import  RescueTypeSerializer

class RescueTypeListView(APIView):
    def get(self, request):
        rescue_types = RescueType.objects.all()
        types_data = [{"_id": str(rt.id), "type": rt.name} for rt in rescue_types]
        return Response(types_data)

    def post(self, request):
        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        rtype = serializer.validated_data["type"]

        if RescueType.objects.filter(name=rtype).exists():
            return Response({"error": "Rescue type already exists"}, status=409)
        
        rescue_type = RescueType(name=rtype)
        rescue_type.save()
        return Response({"message": "Rescue type added", "id": str(rescue_type.id)}, status=201)

    def put(self, request):
        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        rescue_id = serializer.validated_data.get("_id")
        new_type = serializer.validated_data.get("type")
        if not rescue_id:
            return Response({"error": "_id is required"}, status=400)

        try:
            rescue_type = RescueType.objects.get(id=rescue_id)
            rescue_type.name = new_type
            rescue_type.save()
            return Response({"message": "Rescue type updated"})
        except RescueType.DoesNotExist:
            return Response({"error": "Rescue type not found"}, status=404)

    def delete(self, request):
        rescue_id = request.data.get("_id")
        if not rescue_id:
            return Response({"error": "_id is required"}, status=400)

        try:
            rescue_type = RescueType.objects.get(id=rescue_id)
            rescue_type.delete()
            return Response({"message": "Rescue type deleted"})
        except RescueType.DoesNotExist:
            return Response({"error": "Rescue type not found"}, status=404)
