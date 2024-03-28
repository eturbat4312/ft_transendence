from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import User as UserModel
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, get_user_model, logout, login
from django.http import JsonResponse
import json
from .models import GameResult

UserModel = get_user_model()


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        # print("serialized")
        # Hash the password before saving
        # hashed_password = make_password(request.data["password"])
        # serializer.validated_data["password"] = hashed_password

        # Save the user
        serializer.save()

        return Response({"user": serializer.data})
    print("serializer not valid", serializer.errors, serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_username(request):
    if request.user.is_authenticated:
        user = request.user
        username = request.user.username
        serializer = UserSerializer(user, fields=["username", "avatar"])
        print("user serialized")
        return Response(serializer.data)
    else:
        return Response(
            {"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if username is None or password is None:
            return Response(
                {
                    "error": "Veuillez fournir à la fois le nom d'utilisateur et le mot de passe"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)


class GetUsernameView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        username = request.user.username
        serializer = UserSerializer(user, context={"request": request})
        return Response(serializer.data)


class VerifyTokenView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Token is valid"})


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"})


@api_view(["POST"])
def save_game_result(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        score = data["score"]
        # opponentScore = data[‘opponentScore’]
        won = data["won"]

        # Save to database
        result = GameResult(username=username, score=score, won=won)
        result.save()

        return JsonResponse({"status": "success"})
