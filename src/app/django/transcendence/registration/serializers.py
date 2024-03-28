from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    # email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class UserSerializer(serializers.ModelSerializer):
    custom_field = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(required=False)
    print("validating data serializer")

    class Meta:
        model = User
        fields = ["id", "username", "email", "custom_field", "avatar"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print("Serializer data:", data)  # Print the serializer data
        avatar_url = instance.avatar.url if instance.avatar else None
        data["avatar"] = avatar_url
        return data

    # def get_avatar_url(self, obj):
    #     if obj.avatar:
    #         return obj.avatar.url
    #     return None
