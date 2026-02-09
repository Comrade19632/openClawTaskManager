from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.health),
    path('auth/telegram/', views.telegram_login),
    path('auth/dev/', views.dev_login),
    path('me/', views.me),
]
