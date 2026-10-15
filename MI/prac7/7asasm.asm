section .data
    arr times 5 dd 0

    input_msg db "Enter 5 numbers: ", 0
    sum_msg   db "Sum = %d", 10, 0
    avg_msg   db "Average = %d", 10, 0

    fmt db "%d", 0

section .text
global main
extern printf
extern scanf

main:

    ; Print input message
    push input_msg
    call printf
    add esp, 4

    mov esi, arr
    mov ecx, 5

input_loop:
    push ecx

    push esi
    push fmt
    call scanf
    add esp, 8

    pop ecx

    add esi, 4
    loop input_loop

    mov esi, arr
    mov ecx, 5
    xor eax, eax

sum_loop:
    add eax, [esi]
    add esi, 4
    loop sum_loop

    ; Save sum
    mov ebx, eax

    ; Print sum
    push ebx
    push sum_msg
    call printf
    add esp, 8

    mov eax, ebx
    xor edx, edx
    mov ecx, 5
    div ecx

    ; Print average
    push eax
    push avg_msg
    call printf
    add esp, 8

    xor eax, eax
    ret