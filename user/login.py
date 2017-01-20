from django.shortcuts import render
from django.http import HttpResponse
from user.form import login_vlid
def index(request):
    return render(request, 'user/index.html')
def login_post(request):
    if request.method == 'POST':
        form = login_vlid(request.POST)
        if form.is_valid():
            if 'rember' not in request.POST:
                request.session.set_expiry(0);
            else:
                request.session.set_expiry(1209600);
            request.session['user']=request.POST['user']
            return HttpResponse(request.session['user'])
        else:
            firstmessage = form.errors.as_data()
            return render(request,'user/index.html',{'error':firstmessage['user'][0].messages[0]})




