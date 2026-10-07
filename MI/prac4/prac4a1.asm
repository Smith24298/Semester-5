global main

extern printf
extern scanf

section .data

    prompt db "Enter 8 numbers:", 10, 0
    fmtIn db "%d", 0

    msgMax db "Maximum value is: %d", 10, 0
    msgMin db "Minimum value is: %d", 10, 0

    array dd 0, 0, 0, 0, 0, 0, 0, 0

    maxVal dd 0
    minVal dd 0


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


    mov eax, [array]       ; max
    mov edx, [array]       ; min

    mov esi, 1

find_loop:

    mov ebx, [array + esi*4]

    ; Check maximum
    cmp ebx, eax
    jle check_min

    mov eax, ebx

check_min:

    cmp ebx, edx
    jge next_element

    mov edx, ebx

next_element:

    inc esi

    cmp esi, 8
    jl find_loop


    mov [maxVal], eax
    mov [minVal], edx


    push dword [maxVal]
    push msgMax
    call printf
    add esp, 8



    push dword [minVal]
    push msgMin
    call printf
    add esp, 8


    pop edi
    pop esi
    pop ebx

    xor eax, eax

    mov esp, ebp
    pop ebp

    ret