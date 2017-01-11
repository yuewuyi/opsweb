import re
from django import forms
from user.models import User
from django.core.exceptions import ObjectDoesNotExist
class login_vlid(forms.Form):
    pwd = forms.CharField(max_length=600)
    user = forms.CharField(max_length=30)
    def clean_user(self):
        pwd = self.cleaned_data['pwd']
        user = self.cleaned_data['user']
        if not re.search(r'^\w+$',user):
            raise forms.ValidationError('用户名中只能包含字母、数字和下划线')
        try:
            User.objects.get(user=user,pwd=pwd)
            return user
        except ObjectDoesNotExist:
            raise forms.ValidationError('用户名或密码错误')