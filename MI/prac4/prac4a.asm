section .data

    prompt_n     db "Enter number of elements: ", 0
    original_msg db 10, "Original array: ", 0
    max_msg      db 10, "Maximum element: %d", 10, 0
    min_msg      db "Minimum element: %d", 10, 0

    format_in    db "%d", 0
    format_out   db "%d ", 0

    arr times 100 dd 0


section .bss

    n resd 1


section .text

global main

extern printf
extern scanf


main:

    push prompt_n
    call printf
    add esp, 4

    push n
    push format_in
    call scanf
    add esp, 8


    ; --------------------------------
    ; Input array
    ; --------------------------------

    mov esi, 0

input_loop:

    cmp esi, [n]
    jge print_original

    lea eax, [arr + esi*4]

    push eax
    push format_in
    call scanf
    add esp, 8

    inc esi
    jmp input_loop


print_original:

    push original_msg
    call printf
    add esp, 4

    mov esi, 0

print_loop:

    cmp esi, [n]
    jge find_min_max

    push dword [arr + esi*4]
    push format_out
    call printf
    add esp, 8

    inc esi
    jmp print_loop


find_min_max:

    mov eax, [arr]          
    mov ebx, [arr]          

    mov esi, 1              

find_loop:

    cmp esi, [n]
    jge print_result

    mov edx, [arr + esi*4]

    cmp edx, eax
    jle check_min

    mov eax, edx            

check_min:

    cmp edx, ebx
    jge next_element

    mov ebx, edx           

next_element:

    inc esi
    jmp find_loop


print_result:

    push eax
    push max_msg
    call printf
    add esp, 8

    push ebx
    push min_msg
    call printf
    add esp, 8


    xor eax, eax
    ret