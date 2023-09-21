from rest_framework import serializers

from simplystudy.questions.models import Course, Question, QuestionSet, Test, TestQuestion


class CourseSerializer(serializers.ModelField):
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

    class Meta:
        model = QuestionSet
        fields = "__all__"


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
