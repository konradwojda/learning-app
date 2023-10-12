from rest_framework import serializers

from simplystudy.questions.models import Course, Question, QuestionSet, Test, TestQuestion


class CourseSerializer(serializers.ModelSerializer):
    """Serializer dla Course"""

    class Meta:
        model = Course
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer dla modelu Question"""

    class Meta:
        model = Question
        fields = "__all__"


class QuestionSetSerializer(serializers.ModelSerializer):
    """Serializer dla modelu QuestionSet"""

    owner: serializers.Field = serializers.SlugRelatedField(read_only=True, slug_field="username")
    course: serializers.Field = serializers.SlugRelatedField(read_only=True, slug_field="name")
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionSet
        fields = ("id", "name", "description", "owner", "course", "questions")


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
