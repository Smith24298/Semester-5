#include "physical_layer.h"

#include <arpa/inet.h>
#include <errno.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

static double random_unit(void)
{
    return (double)rand() / (double)RAND_MAX;
}

static void simulate_noise(PhysicalLayer *pl, uint8_t *data, size_t length)
{
    if (!pl->noise_enabled)
        return;

    if (pl->frame_loss_rate > 0.0 &&
        random_unit() < pl->frame_loss_rate)
    {
        printf("[PHYSICAL] Simulating packet loss.\n");
        return;
    }

    if (pl->frame_corruption_rate > 0.0 &&
        random_unit() < pl->frame_corruption_rate &&
        length > 6)
    {
        size_t pos = 6 + (size_t)(rand() % (length - 6));
        data[pos] ^= (uint8_t)(1u << (rand() % 8));
        printf("[PHYSICAL] Simulating bit corruption at byte %zu.\n", pos);
    }
}

static int make_socket(void)
{
    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd < 0)
        perror("socket");
    return fd;
}

int physical_init_server(PhysicalLayer *pl, int port)
{
    if (!pl)
        return -1;

    memset(pl, 0, sizeof(*pl));
    pl->sockfd = make_socket();
    if (pl->sockfd < 0)
        return -1;

    int reuse = 1;
    setsockopt(pl->sockfd, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons((uint16_t)port);

    if (bind(pl->sockfd, (struct sockaddr *)&addr, sizeof(addr)) < 0)
    {
        perror("bind");
        close(pl->sockfd);
        return -1;
    }

    srand((unsigned)time(NULL) ^ (unsigned)getpid());
    return 0;
}

int physical_init_client(PhysicalLayer *pl, const char *ip, int port)
{
    if (!pl || !ip)
        return -1;

    memset(pl, 0, sizeof(*pl));
    pl->sockfd = make_socket();
    if (pl->sockfd < 0)
        return -1;

    srand((unsigned)time(NULL) ^ (unsigned)getpid());
    (void)port;
    return 0;
}

void physical_close(PhysicalLayer *pl)
{
    if (pl && pl->sockfd >= 0)
    {
        close(pl->sockfd);
        pl->sockfd = -1;
    }
}

int physical_send(PhysicalLayer *pl,
                  const uint8_t *data,
                  size_t length,
                  const struct sockaddr *dest,
                  socklen_t dest_len)
{
    if (!pl || pl->sockfd < 0 || !data || !dest)
        return -1;

    uint8_t temp[2048];
    if (length > sizeof(temp))
        return -1;

    memcpy(temp, data, length);
    simulate_noise(pl, temp, length);

    /*
     * Loss simulation happens by probabilistically suppressing send.
     * This is separate from corruption simulation so the receiver can
     * detect corrupted frames using the DLL checksum.
     */
    if (pl->noise_enabled &&
        pl->frame_loss_rate > 0.0 &&
        random_unit() < pl->frame_loss_rate)
    {
        printf("[PHYSICAL] Simulating packet loss.\n");
        return (int)length;
    }

    ssize_t sent = sendto(pl->sockfd, temp, length, 0, dest, dest_len);
    if (sent < 0)
    {
        perror("sendto");
        return -1;
    }

    return (int)sent;
}

int physical_receive(PhysicalLayer *pl,
                     uint8_t *buffer,
                     size_t buffer_size,
                     struct sockaddr *src,
                     socklen_t *src_len,
                     int timeout_ms)
{
    if (!pl || pl->sockfd < 0)
        return -1;

    fd_set readfds;
    FD_ZERO(&readfds);
    FD_SET(pl->sockfd, &readfds);

    struct timeval tv;
    tv.tv_sec = timeout_ms / 1000;
    tv.tv_usec = (timeout_ms % 1000) * 1000;

    int ready = select(pl->sockfd + 1, &readfds, NULL, NULL, &tv);

    if (ready == 0)
        return 0; /* timeout */

    if (ready < 0)
    {
        if (errno == EINTR)
            return 0;
        perror("select");
        return -1;
    }

    ssize_t received = recvfrom(pl->sockfd, buffer, buffer_size, 0,
                                src, src_len);

    if (received < 0)
    {
        perror("recvfrom");
        return -1;
    }

    return (int)received;
}
