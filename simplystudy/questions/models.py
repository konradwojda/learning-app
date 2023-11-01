from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


class Course(models.Model):
    """Klasa reprezentująca kurs, do którego mogą być przypisywane zestawy pytań"""

    name = models.CharField(max_length=512)
    university = models.CharField(max_length=512)
    description = models.TextField(null=True, blank=True, max_length=1024)
    owner = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)


class QuestionSet(models.Model):
    """Klasa reprezentująca zestaw pytań do nauki"""

    name = models.CharField(max_length=512)
    description = models.TextField(null=True, blank=True)
    course = models.ForeignKey(to=Course, null=True, blank=True, on_delete=models.SET_NULL)
    owner = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    is_private = models.BooleanField(default=True)


class Question(models.Model):
    """Klasa reprezentująca pojedyńcze pytanie (fiszkę)"""

    content = models.TextField()
    answer = models.TextField()
    image = models.ImageField(blank=True, null=True)
    question_set = models.ForeignKey(
        to=QuestionSet, related_name="questions", on_delete=models.CASCADE
    )


class UserResource(models.Model):
    """Klasa reprezentująca zasób zaobserwowany przez użytkownika"""

    user = models.ForeignKey(to=get_user_model(), on_delete=models.CASCADE)
    question_set = models.ForeignKey(to=QuestionSet, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "question_set")


class Test(models.Model):
    """Klasa reprezentująca test dla danego zestawu pytań"""

    name = models.CharField(max_length=512)
    question_set = models.ForeignKey(
        to=QuestionSet, related_name="tests", on_delete=models.CASCADE
    )


class TestQuestion(models.Model):
    """Klasa reprezentująca pytanie testowe"""

    class TestQuestionType(models.TextChoices):
        """Klasa reprezentująca typ pytania testowego"""

        TEXT_ANSWER = "TEXT", _("Text answer")
        MULTIPLE_CHOICE = "MULTIPLE", _("Multiple choice")
        SINGLE_CHOICE = "SINGLE", _("Single choice")

    test = models.ForeignKey(to=Test, related_name="test_questions", on_delete=models.CASCADE)
    question_type = models.CharField(max_length=128, choices=TestQuestionType.choices)
