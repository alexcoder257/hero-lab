"""
Serializers for Hero Lab API
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import SignalData

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'date_joined')


class SignalDataSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SignalData
        fields = (
            'id', 'user', 'file_name', 'file_size',
            'uploaded_at', 'processed_at',
            'processed_data', 'metrics'
        )
        read_only_fields = ('id', 'user', 'uploaded_at', 'processed_at')


class SignalDataUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

