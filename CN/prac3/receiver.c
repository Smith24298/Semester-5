#include "dll.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void usage(const char *program)
{
    printf("Usage: %s [port] [loss%%] [corruption%%]\n", program);
    printf("Example: %s 5000 10 20\n", program);
}

int main(int argc, char **argv)
{
    if (argc > 4) {
        usage(argv[0]);
        return 1;
    }

    int port = (argc >= 2) ? atoi(argv[1]) : DEFAULT_PORT;
    double loss = (argc >= 3) ? atof(argv[2]) / 100.0 : 0.0;
    double corruption = (argc >= 4) ? atof(argv[3]) / 100.0 : 0.0;

    DataLinkLayer dll;
    dll_init(&dll, 1, loss, corruption);

    if (physical_init_server(&dll.physical, port) < 0)
        return 1;

    printf("=== Simplex One-Bit Stop-and-Wait Receiver ===\n");
    printf("Listening on UDP port %d\n", port);
    printf("Simulated loss: %.1f%%, corruption: %.1f%%\n",
           loss * 100.0, corruption * 100.0);
    printf("Waiting for frames...\n\n");

    uint8_t expected_seq = 0;

    while (1) {
        Frame frame;
        int result = dll_wait_for_frame(&dll, &frame, 0);

        if (result < 0) {
            /*
             * A corrupted DATA frame cannot safely reveal its sequence
             * number. The sender's timeout will cause retransmission.
             */
            printf("[RECEIVER] Corrupted/invalid frame discarded.\n");
            continue;
        }

        if (result == 0)
            continue;

        if (frame.type != FRAME_DATA) {
            printf("[RECEIVER] Non-DATA frame ignored.\n");
            continue;
        }

        if (frame.seq == expected_seq) {
            printf("[RECEIVER] Accepted DATA %u: \"%s\"\n",
                   frame.seq, frame.payload);

            if (dll_send_ack(&dll, frame.seq) < 0) {
                fprintf(stderr, "[RECEIVER] Failed to send ACK.\n");
                break;
            }

            expected_seq ^= 1u;
        } else {
            /*
             * Duplicate frame: this commonly happens when the ACK was
             * lost. Do not deliver the data twice; resend the previous ACK.
             */
            uint8_t previous_seq = expected_seq ^ 1u;

            printf("[RECEIVER] Duplicate DATA %u detected. "
                   "Resending ACK %u.\n",
                   frame.seq, previous_seq);

            dll_send_ack(&dll, previous_seq);
        }
    }

    physical_close(&dll.physical);
    return 0;
}
