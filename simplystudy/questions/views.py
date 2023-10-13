from django.db.models.query import QuerySet
from rest_framework import permissions, viewsets

from simplystudy.questions.models import Course, Question, QuestionSet, Test, TestQuestion
from simplystudy.questions.permissions import OwnerPermissions
from simplystudy.questions.serializers import (
    CourseSerializer,
    QuestionSerializer,
    QuestionSetSerializer,
    TestQuestionSerializer,
    TestSerializer,
)


class QuestionViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Question"""

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuestionSetViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu QuestionSet"""

    queryset = QuestionSet.objects.all()
    serializer_class = QuestionSetSerializer
    permission_classes = [permissions.IsAuthenticated, OwnerPermissions]

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset
        username = self.request.query_params.get("username")
        if username is not None:
            return queryset.filter(owner__username=username)
        return queryset


class CourseViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Course"""

    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, OwnerPermissions]

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset
        username = self.request.query_params.get("username")
        if username is not None:
            return queryset.filter(owner__username=username)
        return queryset


class TestViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Course"""

    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestQuestionViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Course"""

    queryset = TestQuestion.objects.all()
    serializer_class = TestQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
