CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2
LDFLAGS =

COMMON_OBJ = common.o physical_layer.o dll.o

all: sender receiver

sender: sender.o $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

receiver: receiver.o $(COMMON_OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.o sender receiver

.PHONY: all clean
