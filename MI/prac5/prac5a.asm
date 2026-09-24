section .data
    prompt  db "Enter an octal number: ", 0
    result  db 10, "Binary equivalent: ", 0
    fmt_in  db "%31s", 0

section .bss
    input   resb 32

section .text
    extern printf
    extern scanf
    extern putchar
    global main

main:
    push prompt
    call printf
    add esp, 4

    push input
    push fmt_in
    call scanf
    add esp, 8

    xor ebx, ebx        
    mov esi, input
.convert_loop:
    movzx eax, byte [esi]
    test al, al
    je .convert_done
    sub al, '0'
    movzx eax, al
    shl ebx, 3           
    add ebx, eax         
    inc esi
    jmp .convert_loop
.convert_done:

    push result
    call printf
    add esp, 4

    mov edi, 15         
.display_loop:
    mov eax, ebx
    bt eax, edi
    jc .bit_one
    push '0'
    jmp .print_bit
.bit_one:
    push '1'
.print_bit:
    call putchar
    add esp, 4
    dec edi
    jns .display_loop

    push 10
    call putchar
    add esp, 4

    xor eax, eax
    ret