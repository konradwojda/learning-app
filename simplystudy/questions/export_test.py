from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from simplystudy.questions.models import Test
from simplystudy.questions.permissions import TestPermissions
from simplystudy.questions.serializers import TestDetailSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, TestPermissions])
def download_test_html(request, test_id: int):
    test = get_object_or_404(
        Test.objects.prefetch_related("test_questions", "test_questions__question_choices"),
        id=test_id,
    )
    if not TestPermissions().has_object_permission(request=request, view=None, obj=test):
        raise PermissionDenied()
    test_data = TestDetailSerializer(test).data
    return render(
        request, "test-export-template.html", test_data, content_type="text/html; charset=utf-8"
    )
