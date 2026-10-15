#include "dll.h"

#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>

void dll_init(DataLinkLayer *dll, int noise_enabled,
              double loss_rate, double corruption_rate)
{
    memset(dll, 0, sizeof(*dll));
    dll->physical.sockfd = -1;
    dll->physical.noise_enabled = noise_enabled;
    dll->physical.frame_loss_rate = loss_rate;
    dll->physical.frame_corruption_rate = corruption_rate;
}

int dll_send_frame(DataLinkLayer *dll,
                   uint8_t seq,
                   const char *payload,
                   size_t length)
{
    if (!dll || !payload || length > MAX_PAYLOAD || !dll->peer_known)
        return -1;

    Frame frame;
    memset(&frame, 0, sizeof(frame));

    frame.type = FRAME_DATA;
    frame.seq = seq;
    frame.length = (uint16_t)length;
    memcpy(frame.payload, payload, length);
    frame.payload[length] = '\0';
    frame.checksum = frame_checksum(&frame);

    uint8_t buffer[MAX_FRAME_SIZE];
    int encoded = frame_encode(&frame, buffer, sizeof(buffer));
    if (encoded < 0)
        return -1;

    print_frame("[DLL] Sending DATA:", &frame);

    return physical_send(&dll->physical,
                         buffer,
                         (size_t)encoded,
                         (struct sockaddr *)&dll->peer,
                         sizeof(dll->peer));
}

int dll_wait_for_frame(DataLinkLayer *dll,
                       Frame *frame,
                       int timeout_ms)
{
    if (!dll || !frame)
        return -1;

    uint8_t buffer[MAX_FRAME_SIZE];
    struct sockaddr_in source;
    socklen_t source_len = sizeof(source);

    int received = physical_receive(&dll->physical,
                                    buffer,
                                    sizeof(buffer),
                                    (struct sockaddr *)&source,
                                    &source_len,
                                    timeout_ms);

    if (received <= 0)
        return received;

    if (frame_decode(frame, buffer, (size_t)received) < 0)
    {
        printf("[DLL] Invalid frame format.\n");
        return -2;
    }

    dll->peer = source;
    dll->peer_known = 1;

    uint16_t expected = frame_checksum(frame);

    if (expected != frame->checksum)
    {
        printf("[DLL] CHECKSUM ERROR: received=0x%04X expected=0x%04X\n",
               frame->checksum, expected);
        return -2;
    }

    print_frame("[DLL] Received frame:", frame);
    return 1;
}

int dll_send_ack(DataLinkLayer *dll, uint8_t seq)
{
    if (!dll || !dll->peer_known)
        return -1;

    Frame ack;
    memset(&ack, 0, sizeof(ack));
    ack.type = FRAME_ACK;
    ack.seq = seq;
    ack.length = 0;
    ack.checksum = frame_checksum(&ack);

    uint8_t buffer[MAX_FRAME_SIZE];
    int encoded = frame_encode(&ack, buffer, sizeof(buffer));
    
    if (encoded < 0)
        return -1;

    print_frame("[DLL] Sending ACK:", &ack);

    return physical_send(&dll->physical,
                         buffer,
                         (size_t)encoded,
                         (struct sockaddr *)&dll->peer,
                         sizeof(dll->peer));
}
