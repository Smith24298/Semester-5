#ifndef COMMON_H
#define COMMON_H

#include <stdint.h>
#include <stddef.h>

#define DEFAULT_PORT 5000
#define MAX_PAYLOAD 1024
#define MAX_FRAME_SIZE 1100
#define TIMEOUT_MS 2000

typedef enum
{
    FRAME_DATA = 1,
    FRAME_ACK = 2
} FrameType;

/*
 * Wire format:
 * [type:1][seq:1][length:2][checksum:2][payload:length]
 */
typedef struct
{
    uint8_t type;
    uint8_t seq;
    uint16_t length;
    uint16_t checksum;
    char payload[MAX_PAYLOAD];
} Frame;

uint16_t checksum16(const uint8_t *data, uint16_t length);
uint16_t frame_checksum(const Frame *frame);
int frame_encode(const Frame *frame, uint8_t *buffer, size_t buffer_size);
int frame_decode(Frame *frame, const uint8_t *buffer, size_t buffer_size);
void print_frame(const char *prefix, const Frame *frame);

#endif
