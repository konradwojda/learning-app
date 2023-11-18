from typing import Any

from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from simplystudy.questions.models import (
    Course,
    Question,
    QuestionSet,
    Test,
    TestQuestion,
    TestQuestionAnswer,
    UserResource,
)
from simplystudy.users.models import User


class UsernameField(serializers.CharField):
    """Pole reprezentujące nazwę użytkownika właściciela obiektu."""

    def to_internal_value(self, data):
        try:
            return User.objects.get(username=data)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User with this username does not exist."))


class CourseSerializer(serializers.ModelSerializer):
    """Serializer dla Course"""

    owner = UsernameField()

    class Meta:
        model = Course
        fields = ("id", "name", "university", "description", "owner")


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer dla modelu Question"""

    class Meta:
        model = Question
        fields = "__all__"


class QuestionSetDetailSerializer(serializers.ModelSerializer):
    """Serializer dla modelu QuestionSet"""

    owner = UsernameField()
    course = CourseSerializer()
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionSet
        fields = ("id", "name", "description", "owner", "course", "questions", "is_private")


class QuestionSetCreateSerializer(serializers.ModelSerializer):
    """Serializer dla modelu QuestionSet"""

    owner = UsernameField()
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), allow_null=True)

    class Meta:
        model = QuestionSet
        fields = ("id", "name", "description", "owner", "course", "is_private")


class QuestionSetInfoSerializer(serializers.ModelSerializer):
    """Serializer informacji o instancji modelu QuestionSet"""

    owner = UsernameField(read_only=True)

    class Meta:
        model = QuestionSet
        fields = ("id", "name", "description", "course", "owner")


class TestSerializer(serializers.ModelSerializer):
    """Serializer dla Test"""

    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = "__all__"

    def get_questions_count(self, obj: Test):
        return obj.test_questions.count()


class TestQuestionAnswerSerializer(serializers.ModelSerializer):
    """Serializer dla TestQuestionAnswer"""

    class Meta:
        model = TestQuestionAnswer
        fields = ["id", "text", "is_correct"]


class TestQuestionSerializer(serializers.ModelSerializer):
    """Serializer dla TestQuestion"""

    question_choices = TestQuestionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestQuestion
        fields = ["id", "test", "question_type", "is_true", "question", "question_choices"]

    def validate(self, attrs: Any) -> Any:
        answers_correct = [
            ans["is_correct"] for ans in self.initial_data.get("question_choices", [])
        ]
        if (
            attrs["question_type"]
            in [
                TestQuestion.TestQuestionType.SINGLE_CHOICE,
                TestQuestion.TestQuestionType.MULTIPLE_CHOICE,
            ]
            and True not in answers_correct
        ):
            raise serializers.ValidationError(
                _("This question has to have at least one correct answer")
            )
        elif (
            attrs["question_type"] == TestQuestion.TestQuestionType.SINGLE_CHOICE
            and answers_correct.count(True) > 1
        ):
            raise serializers.ValidationError(
                _("This question has to have only one correct answer.")
            )

        return super().validate(attrs)


class TestQuestionDetailSerializer(serializers.ModelSerializer):
    question_choices = TestQuestionAnswerSerializer(many=True)

    class Meta:
        model = TestQuestion
        fields = ("id", "question_type", "question", "question_choices", "is_true")


class TestDetailSerializer(serializers.ModelSerializer):
    test_questions = TestQuestionDetailSerializer(many=True)
    question_set = QuestionSetInfoSerializer()

    class Meta:
        model = Test
        fields = "__all__"


class UserResourceDetailSerializer(serializers.ModelSerializer):
    """Serializer dla informacji o UserResource"""

    user = UsernameField()
    question_set = QuestionSetInfoSerializer()

    class Meta:
        model = UserResource
        fields = "__all__"


class UserResourceCreateSerializer(serializers.ModelSerializer):
    """Serializer dla tworzenia UserResource"""

    user = UsernameField()

    class Meta:
        model = UserResource
        fields = "__all__"
