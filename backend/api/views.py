from __future__ import annotations

import os

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import TelegramAccount
from .telegram_login import TelegramLoginError, verify_telegram_login


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok'})


@api_view(['GET'])
def me(request):
    if not request.user or not request.user.is_authenticated:
        return Response({'error': 'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    tg = getattr(request.user, 'telegram', None)
    return Response({
        'user': {
            'id': request.user.id,
            'username': request.user.username,
        },
        'telegram': {
            'telegram_id': tg.telegram_id if tg else None,
            'username': tg.username if tg else None,
            'first_name': tg.first_name if tg else None,
            'last_name': tg.last_name if tg else None,
            'photo_url': tg.photo_url if tg else None,
        } if tg else None,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def telegram_login(request):
    """Login via Telegram Login Widget.

    Expects JSON body with fields from widget, including `id`, `auth_date`, `hash`.
    Returns token.
    """

    bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
    data = dict(request.data or {})

    try:
        verify_telegram_login(data, bot_token)
    except TelegramLoginError as e:
        return Response({'error': 'telegram_auth_failed', 'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        telegram_id = int(data.get('id'))
    except Exception:
        return Response({'error': 'bad_payload', 'message': 'missing/invalid id'}, status=status.HTTP_400_BAD_REQUEST)

    username = (data.get('username') or '').strip()
    first_name = (data.get('first_name') or '').strip()
    last_name = (data.get('last_name') or '').strip()
    photo_url = (data.get('photo_url') or '').strip()
    auth_date = data.get('auth_date')
    try:
        auth_date = int(auth_date) if auth_date is not None else None
    except Exception:
        auth_date = None

    # Create user
    django_username = f"tg_{telegram_id}"
    user, _ = User.objects.get_or_create(username=django_username)

    TelegramAccount.objects.update_or_create(
        telegram_id=telegram_id,
        defaults={
            'user': user,
            'username': username,
            'first_name': first_name,
            'last_name': last_name,
            'photo_url': photo_url,
            'auth_date': auth_date,
        },
    )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})


def _is_localhost(request) -> bool:
    try:
        host = (request.get_host() or '').split(':', 1)[0].strip().lower()
    except Exception:
        host = ''
    return host in {'localhost', '127.0.0.1'}


@api_view(['POST'])
@permission_classes([AllowAny])
def dev_login(request):
    """Dev-only login for local testing."""

    if not _is_localhost(request):
        return Response({'error': 'forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if os.getenv('DJANGO_DEBUG', '0') != '1':
        return Response({'error': 'forbidden'}, status=status.HTTP_403_FORBIDDEN)

    user, _ = User.objects.get_or_create(username='dev')
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})
