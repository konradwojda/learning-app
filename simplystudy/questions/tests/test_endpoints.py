# type: ignore
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from simplystudy.questions.models import QuestionSet, Test
from simplystudy.questions.serializers import TestDetailSerializer
from simplystudy.questions.tests.fixtures import SAMPLE_USERS, load_sample_data


class DownloadPDFTestCase(APITestCase):
    """Testy sprawdzające endpoint do pobierania pliku PDF z testem"""

    maxDiff = None

    @classmethod
    def setUpTestData(cls) -> None:
        load_sample_data()

    def test_download_test_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        test = Test.objects.get(id=1)
        response = self.client.get("/download_test/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertEqual(
            response["Content-Disposition"],
            "attachment;",
        )
        self.assertEqual(
            response.context.dicts[1].serializer.data, TestDetailSerializer(test).data
        )

    def test_download_test_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/download_test/1")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_download_test_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        test = Test.objects.get(id=1)
        response = self.client.get("/download_test/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertEqual(
            response["Content-Disposition"],
            "attachment;",
        )
        self.assertEqual(
            response.context.dicts[1].serializer.data, TestDetailSerializer(test).data
        )

    def test_download_test_public(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        test = Test.objects.get(id=1)
        response = self.client.get("/download_test/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertEqual(
            response["Content-Disposition"],
            "attachment;",
        )
        self.assertEqual(
            response.context.dicts[1].serializer.data, TestDetailSerializer(test).data
        )
