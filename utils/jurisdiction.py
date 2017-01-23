from user.models import User
from django.core.exceptions import ObjectDoesNotExist
class UserAuth():
    __user=''
    __type=''
    __output = ''
    def __init__(self,user,type):
        self.__user=user
        self.__type=type
    def __auth(self):
            try:
                if self.__type == "show":
                    User.objects.get(user=self.__user,is_show=1)
                elif self.__type == "config":
                    User.objects.get(user=self.__user,is_config=1)
                elif self.__type == "admin":
                    User.objects.get(user=self.__user,is_admin=1)
                elif self.__type == "up":
                    User.objects.get(user=self.__user,is_up=1)
                self.__output = 1
            except ObjectDoesNotExist:
                self.__output = 0
    def GetValue(self):
        self.__auth()
        return self.__output