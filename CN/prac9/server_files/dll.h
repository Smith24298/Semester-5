#ifndef DLL_H
#define DLL_H

#include "common.h"
#include "physical_layer.h"
#include <netinet/in.h>

typedef struct {
    PhysicalLayer physical;
    struct sockaddr_in peer;
    int peer_known;
} DataLinkLayer;

void dll_init(DataLinkLayer *dll, int noise_enabled,
              double loss_rate, double corruption_rate);

int dll_send_frame(DataLinkLayer *dll,
                   uint8_t seq,
                   const char *payload,
                   size_t length);

int dll_wait_for_frame(DataLinkLayer *dll,
                       Frame *frame,
                       int timeout_ms);

int dll_send_ack(DataLinkLayer *dll, uint8_t seq);

#endif
