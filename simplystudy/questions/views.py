from rest_framework import permissions, viewsets

from simplystudy.questions.models import Course, Question, QuestionSet, Test, TestQuestion
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
    permission_classes = [permissions.IsAuthenticated]


class CourseViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Course"""

    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


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
