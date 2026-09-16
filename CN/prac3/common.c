#include "common.h"
#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>

uint16_t checksum16(const uint8_t *data, uint16_t length)
{
    uint32_t sum = 0;

    for (uint16_t i = 0; i < length; ++i)
        sum += data[i];

    while (sum >> 16)
        sum = (sum & 0xFFFF) + (sum >> 16);

    return (uint16_t)(~sum);
}

uint16_t frame_checksum(const Frame *frame)
{
    uint8_t temp[MAX_PAYLOAD + 4];

    temp[0] = frame->type;
    temp[1] = frame->seq;

    uint16_t net_len = htons(frame->length);
    memcpy(temp + 2, &net_len, sizeof(net_len));

    memcpy(temp + 4, frame->payload, frame->length);

    return checksum16(temp, (uint16_t)(frame->length + 4));
}

int frame_encode(const Frame *frame, uint8_t *buffer, size_t buffer_size)
{
    size_t required = 6u + frame->length;
    if (!frame || !buffer || buffer_size < required || frame->length > MAX_PAYLOAD)
        return -1;

    buffer[0] = frame->type;
    buffer[1] = frame->seq;

    uint16_t net_len = htons(frame->length);
    uint16_t checksum = frame->checksum;
    uint16_t net_checksum = htons(checksum);

    memcpy(buffer + 2, &net_len, 2);
    memcpy(buffer + 4, &net_checksum, 2);
    memcpy(buffer + 6, frame->payload, frame->length);

    return (int)required;
}

int frame_decode(Frame *frame, const uint8_t *buffer, size_t buffer_size)
{
    if (!frame || !buffer || buffer_size < 6)
        return -1;

    frame->type = buffer[0];
    frame->seq = buffer[1];

    uint16_t net_len, net_checksum;
    memcpy(&net_len, buffer + 2, 2);
    memcpy(&net_checksum, buffer + 4, 2);

    frame->length = ntohs(net_len);
    frame->checksum = ntohs(net_checksum);

    if (frame->length > MAX_PAYLOAD || buffer_size < (size_t)(6 + frame->length))
        return -1;

    memcpy(frame->payload, buffer + 6, frame->length);
    frame->payload[frame->length] = '\0';

    return 0;
}

void print_frame(const char *prefix, const Frame *frame)
{
    printf("%s type=%u seq=%u length=%u checksum=0x%04X\n",
           prefix,
           frame->type,
           frame->seq,
           frame->length,
           frame->checksum);
}
