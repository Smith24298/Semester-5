
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <endian.h>

#define PORT 8080
#define BUFFER_SIZE 4096

int send_all(int sock, const void *data, size_t len) {
    const char *p = data;

    while (len > 0) {
        ssize_t n = send(sock, p, len, 0);
        if (n <= 0) return -1;

        p += n;
        len -= (size_t)n;
    }

    return 0;
}

int recv_all(int sock, void *data, size_t len) {
    char *p = data;

    while (len > 0) {
        ssize_t n = recv(sock, p, len, 0);
        if (n <= 0) return -1;

        p += n;
        len -= (size_t)n;
    }

    return 0;
}

int connect_server(void) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("socket");
        return -1;
    }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT);
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

    if (connect(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("connect");
        close(sock);
        return -1;
    }

    return sock;
}

int main(void) {
    char command[16] = {0};
    char filename[256] = {0};
    char buffer[BUFFER_SIZE];

    printf("1. Upload file\n");
    printf("2. Download file\n");
    printf("Choose: ");

    int choice;
    if (scanf("%d", &choice) != 1 || (choice != 1 && choice != 2)) {
        printf("Invalid choice.\n");
        return 1;
    }

    printf("Enter filename (in current directory): ");
    if (scanf("%255s", filename) != 1) {
        printf("Invalid filename.\n");
        return 1;
    }

    if (strchr(filename, '/') || strchr(filename, '\\') ||
        strcmp(filename, ".") == 0 ||
        strcmp(filename, "..") == 0) {
        printf("Use a filename only, without directory paths.\n");
        return 1;
    }

    int sock = connect_server();
    if (sock < 0) return 1;

    snprintf(command, sizeof(command), "%s",
             choice == 1 ? "UPLOAD" : "DOWNLOAD");

    if (send_all(sock, command, sizeof(command)) < 0 ||
        send_all(sock, filename, sizeof(filename)) < 0) {
        printf("Failed to send request.\n");
        close(sock);
        return 1;
    }

    if (choice == 1) {
        FILE *file = fopen(filename, "rb");
        if (!file) {
            perror("Cannot open local file");
            close(sock);
            return 1;
        }

        struct stat st;
        if (stat(filename, &st) < 0 || st.st_size < 0) {
            perror("Cannot get file size");
            fclose(file);
            close(sock);
            return 1;
        }

        uint64_t size = htobe64((uint64_t)st.st_size);

        if (send_all(sock, &size, sizeof(size)) < 0) {
            printf("Failed to send file size.\n");
            fclose(file);
            close(sock);
            return 1;
        }

        size_t n;
        int failed = 0;

        while ((n = fread(buffer, 1, sizeof(buffer), file)) > 0) {
            if (send_all(sock, buffer, n) < 0) {
                failed = 1;
                break;
            }
        }

        if (ferror(file)) failed = 1;
        fclose(file);

        if (failed) {
            printf("File transfer failed.\n");
        } else {
            char response[2];

            if (recv_all(sock, response, sizeof(response)) < 0) {
                printf("No server confirmation received.\n");
            } else if (memcmp(response, "OK", 2) == 0) {
                printf("File uploaded successfully!\n");
            } else {
                printf("Server reported an upload failure.\n");
            }
        }

    } else {
        uint64_t network_size;

        if (recv_all(sock, &network_size, sizeof(network_size)) < 0) {
            printf("Failed to receive file size.\n");
            close(sock);
            return 1;
        }

        uint64_t size = be64toh(network_size);

        if (size == UINT64_MAX) {
            printf("File not found on server.\n");
            close(sock);
            return 1;
        }

        FILE *file = fopen(filename, "wb");
        if (!file) {
            perror("Cannot create local file");
            close(sock);
            return 1;
        }

        uint64_t remaining = size;
        int failed = 0;

        while (remaining > 0) {
            size_t chunk = remaining > BUFFER_SIZE
                               ? BUFFER_SIZE : (size_t)remaining;

            if (recv_all(sock, buffer, chunk) < 0) {
                failed = 1;
                break;
            }

            if (fwrite(buffer, 1, chunk, file) != chunk) {
                failed = 1;
                break;
            }

            remaining -= chunk;
        }

        fclose(file);

        if (failed) {
            printf("Download failed or was incomplete.\n");
            unlink(filename);
        } else {
            printf("File downloaded successfully!\n");
        }
    }

    close(sock);
    return 0;
}
