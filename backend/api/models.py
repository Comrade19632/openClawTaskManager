from __future__ import annotations

from django.conf import settings
from django.db import models


class TelegramAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='telegram')
    telegram_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=64, blank=True, default='')
    first_name = models.CharField(max_length=128, blank=True, default='')
    last_name = models.CharField(max_length=128, blank=True, default='')
    photo_url = models.URLField(blank=True, default='')
    auth_date = models.BigIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"tg:{self.telegram_id}"
