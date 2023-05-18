from django.contrib.auth.models import User
from django.db import models


class Question(models.Model):
    content = models.TextField(max_length=10000)
    answer = models.TextField(max_length=10000)
    image = models.ImageField()
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)


class QuestionSet(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField(null=True, blank=True, max_length=10000)
    course_name = models.CharField(max_length=512)
    questions = models.ManyToManyField(Question)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
