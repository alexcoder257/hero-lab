"""
Views for Hero Lab API
"""
import os
import sys
import json
from pathlib import Path
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import SignalData
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    SignalDataSerializer,
    SignalDataUploadSerializer
)

User = get_user_model()

# Add Python modules to path
PYTHON_MODULES_PATH = Path(__file__).resolve().parent.parent.parent.parent / 'python'
if str(PYTHON_MODULES_PATH) not in sys.path:
    sys.path.insert(0, str(PYTHON_MODULES_PATH))

# Lazy import - will be imported when needed
def get_preprocessing_modules():
    """Lazy import of preprocessing modules"""
    from preprocessing.processor import process_signal_file
    from calculator.metrics import calculate_all_metrics
    return process_signal_file, calculate_all_metrics


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login"""
    from django.contrib.auth import authenticate
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Since USERNAME_FIELD is 'email', authenticate with email as username
    user = authenticate(username=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """Upload signal data file"""
    serializer = SignalDataUploadSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    uploaded_file = request.FILES['file']
    
    # Validate file extension
    if not uploaded_file.name.endswith('.txt'):
        return Response(
            {'error': 'Only .txt files are allowed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Save file
    signal_data = SignalData.objects.create(
        user=request.user,
        original_file=uploaded_file,
        file_name=uploaded_file.name,
        file_size=uploaded_file.size
    )
    
    return Response(
        SignalDataSerializer(signal_data).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_data(request, data_id):
    """Process uploaded signal data"""
    try:
        signal_data = SignalData.objects.get(id=data_id, user=request.user)
    except SignalData.DoesNotExist:
        return Response(
            {'error': 'Signal data not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get file path
    file_path = signal_data.original_file.path
    
    try:
        # Import modules
        process_signal_file, calculate_all_metrics = get_preprocessing_modules()
        
        # Preprocess
        processed_data = process_signal_file(file_path)
        
        # Calculate metrics
        metrics = calculate_all_metrics(processed_data)
        
        # Save results
        signal_data.processed_data = processed_data
        signal_data.metrics = metrics
        from django.utils import timezone
        signal_data.processed_at = timezone.now()
        signal_data.save()
        
        return Response({
            'id': str(signal_data.id),
            'processed_data': processed_data,
            'metrics': metrics
        })
    
    except Exception as e:
        return Response(
            {'error': f'Processing failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_result(request, data_id):
    """Get processing result"""
    try:
        signal_data = SignalData.objects.get(id=data_id, user=request.user)
    except SignalData.DoesNotExist:
        return Response(
            {'error': 'Signal data not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not signal_data.processed_data:
        return Response(
            {'error': 'Data not processed yet'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response({
        'id': str(signal_data.id),
        'file_name': signal_data.file_name,
        'processed_data': signal_data.processed_data,
        'metrics': signal_data.metrics,
        'processed_at': signal_data.processed_at
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_data(request):
    """List all signal data for current user"""
    signal_data_list = SignalData.objects.filter(user=request.user)
    serializer = SignalDataSerializer(signal_data_list, many=True)
    return Response(serializer.data)

