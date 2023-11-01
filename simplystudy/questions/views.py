from typing import Any

from django.db.models import Q
from django.db.models.query import QuerySet
from rest_framework import filters, permissions, viewsets
from rest_framework.pagination import PageNumberPagination

from simplystudy.questions.models import (
    Course,
    Question,
    QuestionSet,
    Test,
    TestQuestion,
    UserResource,
)
from simplystudy.questions.permissions import (
    OwnerPermissions,
    QuestionPermissions,
    QuestionSetPermissions,
)
from simplystudy.questions.serializers import (
    CourseSerializer,
    QuestionSerializer,
    QuestionSetCreateSerializer,
    QuestionSetDetailSerializer,
    TestQuestionSerializer,
    TestSerializer,
    UserResourceSerializer,
)


class StandardPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 1000


class QuestionViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu Question"""

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, QuestionPermissions]


class QuestionSetViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """ViewSet dla modelu QuestionSet"""

    queryset = QuestionSet.objects.all()
    permission_classes = [permissions.IsAuthenticated, QuestionSetPermissions]

    def get_serializer_class(self):
        if self.request.method in ["POST", "PATCH"]:
            return QuestionSetCreateSerializer
        else:
            return QuestionSetDetailSerializer

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset
        if not self.request.user.is_superuser:
            queryset = queryset.filter(Q(is_private=False) | Q(owner=self.request.user))
        username = self.request.query_params.get("username")
        if username is not None:
            return queryset.filter(owner__username=username)
        return queryset


class PublicQuestionSetViewSet(viewsets.ReadOnlyModelViewSet):
    """Widok dla publicznych zestawów pytań"""

    queryset = QuestionSet.objects.filter(is_private=False)
    serializer_class = QuestionSetDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "course__name", "owner__username", "description"]


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


class UserResourceViewSet(viewsets.ModelViewSet):
    """ViewSet dla modelu UserResource"""

    queryset = UserResource.objects.all()
    serializer_class = UserResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset
        username = self.request.query_params.get("username")
        if username is not None:
            return queryset.filter(user__username=username)
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
