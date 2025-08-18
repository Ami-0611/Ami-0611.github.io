from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import RescueType
from api.serializers import  RescueTypeSerializer

class RescueTypeListView(APIView):
    def get(self, request):
        rescue_types = RescueType.objects.all()
        types_data = [{"_id": str(rt.id), "name": rt.name} for rt in rescue_types]
        return Response(types_data)

    def post(self, request):
        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        name = serializer.validated_data.get("name") or serializer.validated_data.get("type")

        if RescueType.objects.filter(name=name).count() > 0:
            return Response({"error": "Rescue type already exists"}, status=409)
        
        rescue_type = RescueType(name=name)
        rescue_type.save()
        return Response({"message": "Rescue type added", "id": str(rescue_type.id)}, status=201)

    def put(self, request, rescue_id=None):
        # Handle both URL parameter and request body
        if not rescue_id:
            rescue_id = request.data.get("_id")
        
        if not rescue_id:
            return Response({"error": "Rescue type ID is required"}, status=400)

        serializer = RescueTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        new_name = serializer.validated_data.get("name") or serializer.validated_data.get("type")
        if not new_name:
            return Response({"error": "Name is required"}, status=400)

        try:
            rescue_type = RescueType.objects.get(id=rescue_id)
            rescue_type.name = new_name
            rescue_type.save()
            return Response({"message": "Rescue type updated", "id": str(rescue_type.id), "name": rescue_type.name})
        except RescueType.DoesNotExist:
            return Response({"error": "Rescue type not found"}, status=404)

    def delete(self, request, rescue_id=None):
        # Handle both URL parameter and request body
        if not rescue_id:
            rescue_id = request.data.get("_id")
        
        if not rescue_id:
            return Response({"error": "Rescue type ID is required"}, status=400)

        try:
            rescue_type = RescueType.objects.get(id=rescue_id)
            rescue_type.delete()
            return Response({"message": "Rescue type deleted"})
        except RescueType.DoesNotExist:
            return Response({"error": "Rescue type not found"}, status=404)
