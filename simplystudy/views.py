from django.conf import settings
from django.shortcuts import render
from django.views.generic import TemplateView


class RedirectToAngular(TemplateView):
    def get(self, request, **kwargs):
        return render(request, settings.STATIC_ROOT / "index.html", context=None)
