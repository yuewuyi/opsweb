from django.http import request,response
from user.models import User
def user_auth(func):
    def request_auth(request,type):
        user=request.session['user']
        User.objects.get()
    return request_auth