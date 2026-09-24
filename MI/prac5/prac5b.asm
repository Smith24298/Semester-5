section .data
    prompt  db "Enter a string: ", 0
    label_  db 10, "Converted string: ", 0
    fmt_in  db "%127s", 0

section .bss
    input   resb 128

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

    push label_
    call printf
    add esp, 4

    mov esi, input
.convert_loop:
    movzx eax, byte [esi]
    test al, al
    je .done

    cmp al, 'a'
    jb .check_upper
    cmp al, 'z'
    ja .check_upper
    xor al, 0x20
    jmp .store_char
.check_upper:
    cmp al, 'A'
    jb .store_char
    cmp al, 'Z'
    ja .store_char
    xor al, 0x20
.store_char:
    mov byte [esi], al
    push eax
    call putchar
    add esp, 4
    inc esi
    jmp .convert_loop

.done:
    push 10
    call putchar
    add esp, 4
    xor eax, eax
    ret