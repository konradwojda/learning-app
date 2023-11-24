FROM python:3.9

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements/requirements.txt

RUN pip install gunicorn

EXPOSE 8000

ENV NAME World

CMD ["gunicorn", "simplystudy.wsgi", "--bind", "0.0.0.0:8000"]