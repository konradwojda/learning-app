"""
URL configuration for simplystudy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers

from simplystudy.questions import views
from simplystudy.users.views import UserLogIn, UserViewSet
from simplystudy.views import RedirectToAngular

router = routers.DefaultRouter()
router.register(r"questions", views.QuestionViewSet)
router.register(r"question_sets", views.QuestionSetViewSet)
router.register(r"courses", views.CourseViewSet)
router.register(r"tests", views.TestViewSet)
router.register(r"test_questions", views.TestQuestionViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api-login/", UserLogIn.as_view()),
    re_path(r"^(?P<path>.*)/$", RedirectToAngular.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
