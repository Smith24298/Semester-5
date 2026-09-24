section .data

    prompt_n     db "Enter number of elements: ", 0
    original_msg db 10, "Original array: ", 0
    sorted_msg   db 10, "Sorted array: ", 0

    format_in    db "%d", 0
    format_out   db "%d ", 0
    newline      db 10, 0

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


    ; Input array

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

original_loop:

    cmp esi, [n]
    jge start_sort

    push dword [arr + esi*4]
    push format_out
    call printf
    add esp, 8

    inc esi
    jmp original_loop


start_sort:

    mov ecx, [n]
    dec ecx

outer_loop:

    mov esi, 0

inner_loop:

    cmp esi, ecx
    jge next_pass

    mov eax, [arr + esi*4]
    mov ebx, [arr + esi*4 + 4]

    cmp eax, ebx
    jle no_swap

    mov [arr + esi*4], ebx
    mov [arr + esi*4 + 4], eax

no_swap:

    inc esi
    jmp inner_loop


next_pass:

    loop outer_loop

    push sorted_msg
    call printf
    add esp, 4

    mov esi, 0

sorted_loop:

    cmp esi, [n]
    jge done

    push dword [arr + esi*4]
    push format_out
    call printf
    add esp, 8

    inc esi
    jmp sorted_loop


done:

    push newline
    call printf
    add esp, 4

    xor eax, eax
    ret