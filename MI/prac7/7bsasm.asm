section .data
    format db "%hhu", 0
    even_msg db "EVEN PARITY", 10, 0
    odd_msg  db "ODD PARITY", 10, 0

section .bss
    num resb 1

section .text
    global main
    extern scanf
    extern printf

main:
    ; Take 8-bit input
    push num
    push format
    call scanf
    add esp, 8

    mov al, [num]
    mov bl, 0              ; count of 1s

count:
    shr al, 1              ; Shift right
    jnc next               ; here last bit is coppied at the carry flag so jnc means jump if no carry

    inc bl                 ; Count 1

next:
    test al, al            ; Check if AL = 0
    jnz count

    ; Check count parity
    test bl, 1
    jz even

odd:
    push odd_msg
    call printf
    add esp, 4
    jmp exit

even:
    push even_msg
    call printf
    add esp, 4

exit:
    xor eax, eax
    ret