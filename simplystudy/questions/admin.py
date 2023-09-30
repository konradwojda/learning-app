from django.contrib import admin

from .models import Course, Question, QuestionSet, Test, TestQuestion

admin.site.register(QuestionSet)
admin.site.register(Question)
admin.site.register(Course)
admin.site.register(Test)
admin.site.register(TestQuestion)
