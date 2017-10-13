from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^TomcatThrift/$',views.TomcatThriftLog,name="TomcatThriftLog"),
    url(r'^nginx/$',views.nginxLog,name="nginxLogPage"),
    url(r'^luceneCustomQuery/$',views.luceneQuery,name="luceneQueryPage")
]
