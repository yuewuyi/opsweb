from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,'monitor/index.html')
def config(request):
    return render(request, 'monitor/config.html')