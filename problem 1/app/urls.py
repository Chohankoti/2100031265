from django.urls import path
from .views import NumbersView

urlpatterns = [
    path('numbers/<str:numberid>/', NumbersView.as_view(), name='numbers')
]