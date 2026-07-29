section .text
global main
extern printf

section .data
    ; 32-bit Numbers
    a dd 1234F678H
    b dd 11112222H
    ; Result (32-bit = two 16-bit words)
    sum dw 0,0
    ; Format string
    fmt db "SUM = %08X",10,0

section .text

main:

    ; -----------------------------
    ; Add Lower 16 Bits
    ; -----------------------------

    mov ax,[a]          ; AX = Lower 16 bits of a (F678H)

    add ax,[b]          ; AX = F678H + 2222H
                         ; AX = 189AH
                         ; CF = 1

    mov [sum],ax        ; Store lower 16 bits

    ; -----------------------------
    ; Add Higher 16 Bits
    ; -----------------------------

    mov ax,[a+2]        ; AX = Higher 16 bits of a (1234H)

    adc ax,[b+2]        ; AX = 1234H + 1111H + Carry
                         ; AX = 2346H
    mov [sum+2],ax      ; Store higher 16 bits


    mov eax,[sum]       ; Load complete 32-bit result

    push eax            ; Push result
    push fmt            ; Push format string

    call printf

    add esp,8           ; Remove arguments

    xor eax,eax         ; Return 0
    ret