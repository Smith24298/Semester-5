#ifndef PHYSICAL_LAYER_H
#define PHYSICAL_LAYER_H

#include <stddef.h>
#include <stdint.h>
#include <sys/socket.h>

typedef struct
{
    int sockfd;
    int noise_enabled;
    double frame_loss_rate;
    double frame_corruption_rate;
} PhysicalLayer;

int physical_init_server(PhysicalLayer *pl, int port);
int physical_init_client(PhysicalLayer *pl, const char *ip, int port);
void physical_close(PhysicalLayer *pl);

int physical_send(PhysicalLayer *pl,
                  const uint8_t *data,
                  size_t length,
                  const struct sockaddr *dest,
                  socklen_t dest_len);

int physical_receive(PhysicalLayer *pl,
                     uint8_t *buffer,
                     size_t buffer_size,
                     struct sockaddr *src,
                     socklen_t *src_len,
                     int timeout_ms);

#endif
