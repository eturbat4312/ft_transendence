from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# from rest_framework.contrib.authtoken.models import Token

from .serializers import UserSerializer
from django.contrib.auth.models import User


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data["username"])
        user.set_password(request.data["password"])
        user.save()
        return Response({"user": serializer.data})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
