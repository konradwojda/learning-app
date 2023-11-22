import pdfkit  # type: ignore
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from simplystudy.questions.models import Test
from simplystudy.questions.permissions import TestPermissions
from simplystudy.questions.serializers import TestDetailSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, TestPermissions])
def download_test_pdf(request, test_id: int):
    test = get_object_or_404(
        Test.objects.prefetch_related("test_questions", "test_questions__question_choices"),
        id=test_id,
    )
    if not TestPermissions().has_object_permission(request=request, view=None, obj=test):
        raise PermissionDenied()
    test_data = TestDetailSerializer(test).data
    response = HttpResponse(
        pdfkit.from_string(
            get_template("test-export-template.html").render(test_data),
            options={"encoding": "utf-8"},
        ),
        content_type="application/pdf",
    )
    response["Content-Disposition"] = "attachment;"
    return response
