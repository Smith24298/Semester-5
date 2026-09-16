#!/bin/sh
set -e
make
echo "Build completed."
echo "Receiver: ./receiver 5000 10 10"
echo "Sender:   ./sender <RECEIVER_IP> 5000 10 10"
