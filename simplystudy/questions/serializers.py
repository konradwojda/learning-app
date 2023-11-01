from rest_framework import serializers

from simplystudy.questions.models import (
    Course,
    Question,
    QuestionSet,
    Test,
    TestQuestion,
    UserResource,
)
from simplystudy.users.models import User


class UsernameField(serializers.CharField):
    """Pole reprezentujące nazwę użytkownika właściciela obiektu."""

    def to_internal_value(self, data):
        try:
            return User.objects.get(username=data)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this username does not exist.")


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


class TestSerializer(serializers.ModelSerializer):
    """Serializer dla Test"""

    class Meta:
        model = Test
        fields = "__all__"


class TestQuestionSerializer(serializers.ModelSerializer):
    """Serializer dla TestQuestion"""

    class Meta:
        model = TestQuestion
        fields = "__all__"


class UserResourceSerializer(serializers.ModelSerializer):
    """Serializer dla UserResource"""

    user = UsernameField()

    class Meta:
        model = UserResource
        fields = "__all__"
