
section .data
    input_msg db "Enter number of terms: ", 0
    series_msg db "Fibonacci series: ", 0
    invalid_msg db "Enter a positive number!", 10, 0

    fmt db "%d", 0
    num_fmt db "%d ", 0
    newline db 10, 0

    n dd 0
    prev dd 0
    curr dd 1
    next dd 0

section .text
global main
extern printf
extern scanf

main:
    ; Read N
    push input_msg
    call printf
    add esp, 4

    push n
    push fmt
    call scanf
    add esp, 8

    ; Check N > 0
    mov eax, [n]
    cmp eax, 0
    jle invalid_input

    push series_msg
    call printf
    add esp, 4

    ; Call Fibonacci procedure
    call fibonacci

    push newline
    call printf
    add esp, 4

    xor eax, eax
    ret

invalid_input:
    push invalid_msg
    call printf
    add esp, 4

    xor eax, eax
    ret


; ----------------------------------
; NEAR PROCEDURE: fibonacci
; Uses memory variables for state
; ----------------------------------

fibonacci:
    mov dword [prev], 0
    mov dword [curr], 1

    mov ecx, [n]

fib_loop:
    ; Print current Fibonacci number
    mov eax, [prev]

    push ecx
    push eax
    push num_fmt
    call printf
    add esp, 8
    pop ecx

    ; next = prev + curr
    mov eax, [prev]
    add eax, [curr]
    mov [next], eax

    ; prev = curr
    mov eax, [curr]
    mov [prev], eax

    ; curr = next
    mov eax, [next]
    mov [curr], eax

    loop fib_loop

    ret
