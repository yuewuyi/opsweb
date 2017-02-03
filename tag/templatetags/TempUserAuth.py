from django import template

register = template.Library()

@register.simple_tag()
def current_time(st1,st2):
    print(st1)
