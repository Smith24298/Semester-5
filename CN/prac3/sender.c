#include "dll.h"

#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void usage(const char *program)
{
    printf("Usage: %s <receiver-ip> [port] [loss%%] [corruption%%]\n", program);
    printf("Example: %s 192.168.1.20 5000 20 10\n", program);
}

int main(int argc, char **argv)
{
    if (argc < 2) {
        usage(argv[0]);
        return 1;
    }

    const char *receiver_ip = argv[1];
    int port = (argc >= 3) ? atoi(argv[2]) : DEFAULT_PORT;
    double loss = (argc >= 4) ? atof(argv[3]) / 100.0 : 0.0;
    double corruption = (argc >= 5) ? atof(argv[4]) / 100.0 : 0.0;

    DataLinkLayer dll;
    dll_init(&dll, 1, loss, corruption);

    if (physical_init_client(&dll.physical, receiver_ip, port) < 0)
        return 1;

    memset(&dll.peer, 0, sizeof(dll.peer));
    dll.peer.sin_family = AF_INET;
    dll.peer.sin_port = htons((uint16_t)port);

    if (inet_pton(AF_INET, receiver_ip, &dll.peer.sin_addr) != 1) {
        fprintf(stderr, "Invalid receiver IP address: %s\n", receiver_ip);
        physical_close(&dll.physical);
        return 1;
    }

    dll.peer_known = 1;

    printf("=== Simplex One-Bit Stop-and-Wait Sender ===\n");
    printf("Receiver: %s:%d\n", receiver_ip, port);
    printf("Simulated loss: %.1f%%, corruption: %.1f%%\n",
           loss * 100.0, corruption * 100.0);
    printf("Enter messages. Type /quit to exit.\n\n");

    uint8_t seq = 0;
    char message[MAX_PAYLOAD];

    while (1) {
        printf("You: ");
        fflush(stdout);

        if (!fgets(message, sizeof(message), stdin))
            break;

        message[strcspn(message, "\n")] = '\0';

        if (strcmp(message, "/quit") == 0)
            break;

        if (message[0] == '\0')
            continue;

        int acknowledged = 0;
        int attempt = 0;

        while (!acknowledged) {
            ++attempt;

            if (attempt > 1)
                printf("[SENDER] Retransmitting frame (attempt %d)...\n", attempt);

            if (dll_send_frame(&dll, seq, message, strlen(message)) < 0) {
                fprintf(stderr, "[SENDER] Failed to send frame.\n");
                physical_close(&dll.physical);
                return 1;
            }

            Frame response;
            int result = dll_wait_for_frame(&dll, &response, TIMEOUT_MS);

            if (result == 0) {
                printf("[SENDER] TIMEOUT. No ACK received.\n");
                continue;
            }

            if (result < 0) {
                printf("[SENDER] Invalid/corrupted response. Waiting for ACK again.\n");
                continue;
            }

            if
                printf("[SENDER] Unexpected frame. Expected ACK %u.\n", seq);
            }
        }
    }

    physical_close(&dll.physical);
    printf("Sender terminated.\n");
    return 0;
}
 (response.type == FRAME_ACK && response.seq == seq) {
                printf("[SENDER] ACK %u received. Frame delivered successfully.\n\n", seq);
                acknowledged = 1;
                seq ^= 1u;
            } else {