from rest_framework import serializers
from .models import User, FriendRequest, Message


class RegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    profil_pic = serializers.ImageField(required=False, allow_null=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profil_pic']

    def create(self, validated_data):
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