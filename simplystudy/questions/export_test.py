import pdfkit
from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from simplystudy.questions.models import Test
from simplystudy.questions.permissions import TestPermissions
from simplystudy.questions.serializers import TestDetailSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, TestPermissions])
def render_to_pdf(request, test_id: int):
    try:
        test_data = TestDetailSerializer(
            Test.objects.prefetch_related(
                "test_questions", "test_questions__question_choices"
            ).get(id=test_id)
        ).data
    except Test.DoesNotExist:
        return HttpResponse(status=404)
    response = HttpResponse(
        pdfkit.from_string(get_template("test-export-template.html").render(test_data)),
        content_type="application/pdf",
    )
    response["Content-Disposition"] = (
        'attachment; filename="' + f"test_{test_data['name']}" + '.pdf"'
    )
    return response
