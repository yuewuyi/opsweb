from django.shortcuts import render
from django.http import HttpResponse
from user.models import User
# Create your views here.
def index(request):
    return render(request,'monitor/index.html')
def config(request):
    return render(request, 'monitor/config.html')