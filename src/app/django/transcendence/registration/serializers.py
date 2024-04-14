from rest_framework import serializers
from .models import User, FriendRequest, Message, Match, TicMatch


class RegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=10)
    email = serializers.EmailField()
    profil_pic = serializers.ImageField(required=False, allow_null=True)
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)
    bio = serializers.CharField(max_length=255, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profil_pic', 'bio']
    
    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def validate_username(self, value):
        blocked_usernames = ["admin", "root", "draw"]
        if value in blocked_usernames:
            raise serializers.ValidationError("This username is not allowed.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        print("create function serializer !!!")
        profil_pic = validated_data.pop('profil_pic', 'default.png')  # Default avatar if not provided
        user = User.objects.create_user(profil_pic=profil_pic, **validated_data)
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserSerializer(serializers.ModelSerializer):
    custom_field = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "custom_field"]


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'player', 'opponent', 'player_score', 'opponent_score', 'winner', 'played_at']

class TicMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicMatch
        fields = ['id', 'player', 'opponent', 'match_status', 'played_at']