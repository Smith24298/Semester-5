global main

extern printf
extern scanf

section .data

    prompt db "Enter 8 numbers:", 10, 0
    fmtIn db "%d", 0

    msgSorted db "Array in ascending order:", 10, 0
    fmtNum db "%d ", 0
    newline db 10, 0

    array dd 0, 0, 0, 0, 0, 0, 0, 0


section .text

main:

    push ebp
    mov ebp, esp

    push ebx
    push esi
    push edi
    push prompt
    call printf
    add esp, 4


    xor esi, esi

input_loop:

    lea eax, [array + esi*4]

    push eax
    push fmtIn
    call scanf
    add esp, 8

    inc esi

    cmp esi, 8
    jl input_loop


    mov ecx, 7            

outer_loop:

    xor esi, esi

    mov edx, ecx           

inner_loop:

    mov eax, [array + esi*4]
    mov ebx, [array + esi*4 + 4]

    cmp eax, ebx
    jle no_swap

    ; Swap
    mov [array + esi*4], ebx
    mov [array + esi*4 + 4], eax

no_swap:

    inc esi

    dec edx
    jnz inner_loop

    dec ecx
    jnz outer_loop


    push msgSorted
    call printf
    add esp, 4

    xor esi, esi

print_loop:

    push dword [array + esi*4]
    push fmtNum
    call printf
    add esp, 8

    inc esi

    cmp esi, 8
    jl print_loop


    push newline
    call printf
    add esp, 4


    pop edi
    pop esi
    pop ebx

    xor eax, eax

    mov esp, ebp
    pop ebp

    ret