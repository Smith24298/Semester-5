
section .data
    input_msg db "Enter a number: ", 0

    prime_msg    db "Number is PRIME", 10, 0
    notprime_msg db "Number is NOT PRIME", 10, 0

    odd_msg  db "Number is ODD", 10, 0
    even_msg db "Number is EVEN", 10, 0

    fmt db "%d", 0
    num dd 0

section .text
global main
extern printf
extern scanf

main:
    ; Read number
    push input_msg
    call printf
    add esp, 4

    push num
    push fmt
    call scanf
    add esp, 8

    ; -----------------------
    ; Check PRIME
    ; -----------------------
    call check_prime

    cmp eax, 1
    je print_prime

    push notprime_msg
    call printf
    add esp, 4
    jmp check_parity

print_prime:
    push prime_msg
    call printf
    add esp, 4

check_parity:
    ; -----------------------
    ; Check ODD
    ; -----------------------
    call check_odd

    cmp eax, 1
    je print_odd

    ; If not odd, print even
    push even_msg
    call printf
    add esp, 4
    jmp program_exit

print_odd:
    push odd_msg
    call printf
    add esp, 4

program_exit:
    xor eax, eax
    ret


; ----------------------------------
; PROCEDURE 1: check_prime
; EAX = 1 if prime, otherwise 0
; ----------------------------------

check_prime:
    mov ebx, [num]

    ; Numbers less than 2 are not prime
    cmp ebx, 2
    jl not_prime

    ; 2 is prime
    cmp ebx, 2
    je is_prime

    mov esi, 2

prime_loop:
    ; Stop when divisor * divisor > num
    mov eax, esi
    imul eax, esi
    cmp eax, ebx
    jg is_prime

    ; Divide num by divisor
    mov eax, ebx
    xor edx, edx
    div esi

    ; Remainder zero means not prime
    cmp edx, 0
    je not_prime

    inc esi
    jmp prime_loop

is_prime:
    mov eax, 1
    ret

not_prime:
    xor eax, eax
    ret


; ----------------------------------
; PROCEDURE 2: check_odd
; EAX = 1 if odd, otherwise 0
; ----------------------------------

check_odd:
    mov eax, [num]
    test eax, 1
    jnz is_odd

    xor eax, eax
    ret

is_odd:
    mov eax, 1
    ret


; ----------------------------------
; PROCEDURE 3: check_even
; EAX = 1 if even, otherwise 0
; ----------------------------------

check_even:
    mov eax, [num]
    test eax, 1
    jz is_even

    xor eax, eax
    ret

is_even:
    mov eax, 1
    ret
