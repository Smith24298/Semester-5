
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
#include <stdint.h>
#include <endian.h>

#define PORT 8080
#define BUFFER_SIZE 4096
#define STORAGE_DIR "server_files"

void receive_all(int sock, void *buffer, size_t length) {
    char *ptr = buffer;

    while (length > 0) {
        ssize_t n = recv(sock, ptr, length, 0);

        if (n <= 0) {
            return;
        }

        ptr += n;
        length -= n;
    }
}

void send_all(int sock, const void *buffer, size_t length) {
    const char *ptr = buffer;

    while (length > 0) {
        ssize_t n = send(sock, ptr, length, 0);

        if (n <= 0) {
            return;
        }

        ptr += n;
        length -= n;
    }
}

void *handle_client(void *arg) {
    int client_sock = *(int *)arg;
    free(arg);

    char command[16] = {0};
    char filename[256] = {0};
    char buffer[BUFFER_SIZE];

    // Read the command.
    receive_all(client_sock, command, sizeof(command));

    // Read the filename.
    receive_all(client_sock, filename, sizeof(filename));

    // Prevent directory traversal.
    if (strchr(filename, '/') || strchr(filename, '\\') ||
        strcmp(filename, ".") == 0 ||
        strcmp(filename, "..") == 0) {
        close(client_sock);
        return NULL;
    }

    char path[512];
    snprintf(path, sizeof(path), "%s/%s", STORAGE_DIR, filename);

    if (strcmp(command, "UPLOAD") == 0) {
        uint64_t network_size = 0;
        receive_all(client_sock, &network_size, sizeof(network_size));

        uint64_t remaining = be64toh(network_size);
        int file = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);

        if (file < 0) {
            close(client_sock);
            return NULL;
        }

        while (remaining > 0) {
            size_t chunk = remaining > BUFFER_SIZE
                               ? BUFFER_SIZE : (size_t)remaining;

            ssize_t n = recv(client_sock, buffer, chunk, 0);
            if (n <= 0) {
                break;
            }

            size_t written = 0;
            while (written < (size_t)n) {
                ssize_t w = write(file, buffer + written,
                                  (size_t)n - written);
                if (w <= 0) {
                    break;
                }
                written += (size_t)w;
            }

            remaining -= (uint64_t)n;
        }

        close(file);

        if (remaining == 0) {
            send_all(client_sock, "OK", 2);
        } else {
            send_all(client_sock, "ER", 2);
        }

    } else if (strcmp(command, "DOWNLOAD") == 0) {
        int file = open(path, O_RDONLY);

        if (file < 0) {
            uint64_t size = htobe64(UINT64_MAX);
            send_all(client_sock, &size, sizeof(size));
        } else {
            struct stat st;
            fstat(file, &st);

            uint64_t size = htobe64((uint64_t)st.st_size);
            send_all(client_sock, &size, sizeof(size));

            ssize_t n;
            while ((n = read(file, buffer, sizeof(buffer))) > 0) {
                send_all(client_sock, buffer, (size_t)n);
            }

            close(file);
        }
    }

    close(client_sock);
    return NULL;
}

int main(void) {
    mkdir(STORAGE_DIR, 0755);

    int server_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (server_sock < 0) {
        perror("socket");
        return 1;
    }

    int opt = 1;
    setsockopt(server_sock, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in server_addr = {0};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(server_sock, (struct sockaddr *)&server_addr,
             sizeof(server_addr)) < 0) {
        perror("bind");
        close(server_sock);
        return 1;
    }

    if (listen(server_sock, 10) < 0) {
        perror("listen");
        close(server_sock);
        return 1;
    }

    printf("File server listening on port %d...\n", PORT);

    while (1) {
        struct sockaddr_in client_addr;
        socklen_t addr_len = sizeof(client_addr);

        int *client_sock = malloc(sizeof(int));
        if (!client_sock) {
            continue;
        }

        *client_sock = accept(server_sock,
                              (struct sockaddr *)&client_addr,
                              &addr_len);

        if (*client_sock < 0) {
            perror("accept");
            free(client_sock);
            continue;
        }

        pthread_t thread;
        if (pthread_create(&thread, NULL, handle_client, client_sock) != 0) {
            close(*client_sock);
            free(client_sock);
            continue;
        }

        pthread_detach(thread);
    }

    close(server_sock);
    return 0;
}
