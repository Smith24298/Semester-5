section .data
    prompt  db "Enter a string: ", 0
    label_  db 10, "Reversed string: ", 0
    fmt_in  db "%127s", 0
    fmt_out db "%s", 10, 0

section .bss
    input   resb 128

section .text
    extern printf
    extern scanf
    global main

main:
    push prompt
    call printf
    add esp, 4

    push input
    push fmt_in
    call scanf
    add esp, 8

    push input
    call reverse_string     
    add esp, 4

    push label_
    call printf
    add esp, 4

    push input
    push fmt_out
    call printf
    add esp, 8

    xor eax, eax
    ret

reverse_string:
    push ebp
    mov ebp, esp
    push ebx
    push esi
    push edi

    mov esi, [ebp+8]   
    mov edi, esi

.find_end:
    cmp byte [edi], 0
    je .end_found
    inc edi
    jmp .find_end
.end_found:
    dec edi                

.swap_loop:
    cmp esi, edi
    jge .swap_done
    mov al, [esi]
    mov bl, [edi]
    mov [edi], al
    mov [esi], bl
    inc esi
    dec edi
    jmp .swap_loop
.swap_done:

    pop edi
    pop esi
    pop ebx
    pop ebp
    ret