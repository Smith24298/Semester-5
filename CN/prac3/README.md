# Simplex One-Bit Stop-and-Wait Protocol in C

Computer Networks practical implementation using UDP socket programming.

## Architecture

```text
+-------------------+                 +-------------------+
|      sender       |                 |     receiver      |
|                   |                 |                   |
| Data Link Layer   |                 | Data Link Layer   |
| - framing        |                 | - framing        |
| - seq 0/1        |                 | - seq 0/1        |
| - checksum       |                 | - checksum       |
| - ACK            |                 | - ACK            |
| - timeout        |                 | - duplicate      |
| - retransmission |                 |   detection       |
+---------+---------+                 +---------+---------+
          |                                     |
          v                                     v
+-------------------+                 +-------------------+
| Physical Layer    |<---- UDP -----> | Physical Layer    |
| socket/sendto     |                 | socket/recvfrom   |
+-------------------+                 +-------------------+
```

The physical layer is responsible for UDP socket communication and optional
noise simulation. The data link layer implements framing, one-bit sequence
numbers, checksums, ACKs, timeout/retransmission, and duplicate detection.

## Files

- `common.h/.c` - frame definition, encoding/decoding, checksum
- `physical_layer.h/.c` - UDP socket layer and optional noise simulation
- `dll.h/.c` - data link layer
- `sender.c` - simplex sender
- `receiver.c` - simplex receiver
- `Makefile` - Linux/macOS build
- `README.md` - instructions

## Frame Format

```text
+--------+--------+----------+----------+----------------+
| Type   | Seq    | Length   | Checksum | Payload        |
| 1 byte | 1 byte | 2 bytes  | 2 bytes | 0..1024 bytes  |
+--------+--------+----------+----------+----------------+
```

Sequence numbers alternate:

```text
0 -> 1 -> 0 -> 1 -> ...
```

## Build on Linux

```bash
make
```

Or manually:

```bash
gcc -Wall -Wextra -std=c11 -O2 -o receiver receiver.c dll.c physical_layer.c common.c
gcc -Wall -Wextra -std=c11 -O2 -o sender sender.c dll.c physical_layer.c common.c
```

## Run on the receiver machine

```bash
./receiver 5000 10 10
```

Arguments:

```text
receiver <port> <loss_percent> <corruption_percent>
```

For example, `10 10` means 10% simulated packet loss and 10% simulated
corruption.

## Run on the sender machine

Find the receiver machine's LAN IP, for example `192.168.1.20`, then:

```bash
./sender 192.168.1.20 5000 10 10
```

Arguments:

```text
sender <receiver-ip> <port> <loss_percent> <corruption_percent>
```

On Windows with MinGW, compile similarly:

```bash
gcc -Wall -Wextra -std=c11 -O2 -o receiver.exe receiver.c dll.c physical_layer.c common.c -lws2_32
gcc -Wall -Wextra -std=c11 -O2 -o sender.exe sender.c dll.c physical_layer.c common.c -lws2_32
```

Important: the current source uses POSIX socket APIs (`sys/socket.h`,
`arpa/inet.h`, `unistd.h`). For native Windows/MinGW, a small Winsock
portability layer is needed. The Linux version is ready to compile with GCC.

## Demonstration

Start receiver:

```text
=== Simplex One-Bit Stop-and-Wait Receiver ===
Listening on UDP port 5000
Waiting for frames...
```

Start sender:

```text
=== Simplex One-Bit Stop-and-Wait Sender ===
Receiver: 192.168.1.20:5000
You: Hello
[DLL] Sending DATA: type=1 seq=0 ...
[DLL] Received frame: type=2 seq=0 ...
[SENDER] ACK 0 received. Frame delivered successfully.
```

Then the next message uses sequence number 1.

With noise enabled, you may see:

```text
[PHYSICAL] Simulating packet loss.
[SENDER] TIMEOUT. No ACK received.
[SENDER] Retransmitting frame (attempt 2)...
```

or:

```text
[PHYSICAL] Simulating bit corruption ...
[DLL] CHECKSUM ERROR ...
[SENDER] Invalid/corrupted response. Waiting for ACK again.
```

## Important note about the practical

The supplied practical document states the aim as implementing a simplex one-bit
stop-and-wait protocol over a socket-based physical layer, with framing,
sequence numbering, acknowledgements, timeout/retransmission, and noise
handling. This C project implements those requested components as separate
modules.
