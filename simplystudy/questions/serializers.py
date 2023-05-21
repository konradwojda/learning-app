from rest_framework import serializers

from simplystudy.questions.models import Question, QuestionSet


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
