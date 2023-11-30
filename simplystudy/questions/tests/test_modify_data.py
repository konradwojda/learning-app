from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from simplystudy.questions.models import (
    Course,
    Question,
    QuestionSet,
    Test,
    TestQuestion,
    TestQuestionAnswer,
    UserResource,
)
from simplystudy.questions.tests.fixtures import SAMPLE_USERS, load_sample_data
from simplystudy.users.models import User


class ModifyDataTests(APITestCase):
    """Testy sprawdzające API służące do zmiany danych oraz ich usuwania."""

    maxDiff = None

    @classmethod
    def setUpTestData(cls) -> None:
        load_sample_data()

    def test_data_loaded(self) -> None:
        self.assertTrue(User.objects.count(), 2)
        self.assertTrue(Course.objects.count(), 2)
        self.assertTrue(QuestionSet.objects.count(), 2)
        self.assertTrue(Question.objects.count(), 2)
        self.assertTrue(Test.objects.count(), 1)
        self.assertTrue(TestQuestion.objects.count(), 4)
        self.assertTrue(TestQuestionAnswer.objects.count(), 5)

    def test_add_question_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/questions/",
            {"content": "content", "answer": "answer", "question_set": 1},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.logout()
