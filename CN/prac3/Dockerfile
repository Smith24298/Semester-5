FROM gcc:latest

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends make nano iproute2 iputils-ping && \
    rm -rf /var/lib/apt/lists/*

# Copy all project files into /app
COPY common.h .
COPY common.c .
COPY physical_layer.h .
COPY physical_layer.c .
COPY dll.h .
COPY dll.c .
COPY sender.c .
COPY receiver.c .
COPY Makefile .

# Compile the project during image creation
RUN make

# Start an interactive shell
CMD ["bash"]