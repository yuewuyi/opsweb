from django.shortcuts import render
from user.form import LoginVlid
from django.http import HttpResponse,HttpResponseRedirect
from django.core.urlresolvers import reverse
def index(request):
    return render(request,'user/index.html')
def login_post(request):
    if request.method == 'POST':
        form = LoginVlid(request.POST)
        if form.is_valid():
            if 'rember' not in request.POST:
                request.session.set_expiry(0);
            else:
                request.session.set_expiry(1209600);
            request.session['user'] = request.POST['user']
            return   HttpResponseRedirect(reverse('MonitorIndex'))
        else:
            firstmessage = form.errors.as_data()
            return render(request,'user/index.html',{'error':firstmessage['user'][0].messages[0]})
    else:
        return HttpResponse(status=404)
def signOut(request):
    if request.method == 'POST':
        request.session.flush()
        return HttpResponse('')
    else:
        return HttpResponse(status=404)


