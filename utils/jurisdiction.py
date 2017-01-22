from user.models import User
from django.core.exceptions import ObjectDoesNotExist
class UserAuth():
    def __init__(self,user,type):
        self.__auth(user,type)
    def __auth(self,user,type):
            try:
                if type == "show":
                    User.objects.get(user=user,is_show=1)
                elif type == "config":
                    User.objects.get(user=user, is_config=1)
                elif type == "admin":
                    User.objects.get(user=user, is_admin=1)
                elif type == "up":
                    User.objects.get(user=user, is_up=1)
                return 1
            except ObjectDoesNotExist:
                return 0