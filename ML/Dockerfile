FROM jupyter/scipy-notebook:latest

COPY requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /home/smith/work

EXPOSE 8888