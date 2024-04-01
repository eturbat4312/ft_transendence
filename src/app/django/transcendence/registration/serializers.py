from rest_framework import serializers
from .models import User





class RegisterSerializer(serializers.ModelSerializer):
    print("create function serializer")
    password = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'avatar']

    def create(self, validated_data):
        print("create function serializer !!!")
        avatar = validated_data.pop('avatar', 'default.png')  # Default avatar if not provided
        user = User.objects.create_user(avatar=avatar, **validated_data)
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
