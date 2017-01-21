from django.shortcuts import render
from django.http import HttpResponse
from django.http import request,response
from user.models import User
def user_auth(func):
    def request_auth(request):
        try:
            user=request.session['user']
        except:
            return render(request,'user/index.html')
    return request_auth
@user_auth
def index(request):
    # return render(request, 'home/index.html')
    return HttpResponse(request.session['user'])