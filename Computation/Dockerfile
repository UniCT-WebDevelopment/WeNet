FROM python:3.9

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

COPY . /app

ENV PYTHONUNBUFFERED=0

ENTRYPOINT [ "python" ]

CMD ["graph_server.py" ]