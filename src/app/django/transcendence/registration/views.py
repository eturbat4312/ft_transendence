from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, FriendRequestSerializer
from .models import User as UserModel
from .models import FriendRequest
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, get_user_model, logout, login

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
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'error': 'Veuillez fournir à la fois le nom d\'utilisateur et le mot de passe'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if not user:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

class GetUsernameView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.username
        return Response({'username': username})

class GetUserIdView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        return Response({'user_id': user_id})

class GetUsernameFromIdView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = UserModel.objects.get(id=user_id)
            username = user.username
            return Response({'username': username})
        except User.DoesNotExist:
            return Response({'username': 'Unknown User'})

class SendFriendRequestView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, to_user_id):
        to_user = get_object_or_404(UserModel, id=to_user_id)
        existing_request = FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists()
        existing_request2 = FriendRequest.objects.filter(from_user=to_user, to_user=request.user).exists()
        if existing_request or existing_request2:
            return Response({'status': 'error', 'message': 'Friend request already sent.'})
        friend_request = FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        return Response({'status': 'success', 'friend_request_id': friend_request.id})

class FriendRequestsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        received_requests = FriendRequest.objects.filter(to_user=request.user, status='pending')
        serializer = FriendRequestSerializer(received_requests, many=True)
        return Response(serializer.data)

class RespondFriendRequestView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, from_user_id):
        friend_request = get_object_or_404(FriendRequest, from_user_id=from_user_id, to_user=request.user)
        from_user = get_object_or_404(UserModel, id=from_user_id)
        if friend_request.to_user != request.user:
            return Response({'status': 'error', 'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        action = request.data.get('action')

        if action == 'accept':
            request.user.friends.add(from_user)
            from_user.friends.add(request.user)
            friend_request.delete()
            return Response({'status': 'success', 'message': 'Friend request accepted.'})

        elif action == 'reject':
            friend_request.delete()
            return Response({'status': 'success', 'message': 'Friend request rejected.'})

        else:
            return Response({'status': 'error', 'message': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

class RemoveFriendView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_id):
        current_user = request.user
        
        try:
            friend = UserModel.objects.get(id=friend_id)
        except UserModel.DoesNotExist:
            return Response({'error': 'Friend not found'}, status=status.HTTP_404_NOT_FOUND)
        
        current_user.friends.remove(friend)
        friend.friends.remove(current_user)
        
        return Response({'success': 'Friend removed successfully'}, status=status.HTTP_200_OK)

class GetFriendsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        friends = current_user.friends.all()
        serializer = UserSerializer(friends, many=True)
        return Response({'friends': serializer.data})

class VerifyTokenView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Token is valid'})

class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'})