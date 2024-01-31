from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import User as UserModel
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        # print("serialized")
        # Hash the password before saving
        hashed_password = make_password(request.data["password"])
        serializer.validated_data["password"] = hashed_password

        # Save the user
        serializer.save()

        return Response({"user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    user = authenticate(
        username=request.data["username"], password=request.data["password"]
    )

    if user is not None:
        serializer = UserSerializer(instance=user)
        return Response({"user": serializer.data})
    else:
        return Response(
            {"error": "Wrong username or password"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"passed for {}".format(request.user.username)})
