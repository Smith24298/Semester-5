
section .data
    main_msg db "Enter main string: ", 0
    sub_msg  db "Enter substring: ", 0

    found_msg    db "Substring found!", 10, 0
    notfound_msg db "Substring not found!", 10, 0

    main_str times 100 db 0
    sub_str  times 100 db 0

    fmt_main db "%99s", 0
    fmt_sub  db "%99s", 0

section .text
global main
extern printf
extern scanf

main:
    ; Read main string
    push main_msg
    call printf
    add esp, 4

    push main_str
    push fmt_main
    call scanf
    add esp, 8

    ; Read substring
    push sub_msg
    call printf
    add esp, 4

    push sub_str
    push fmt_sub
    call scanf
    add esp, 8

    ; Call NEAR procedure
    call find_substring

    cmp eax, 1
    je found

    push notfound_msg
    call printf
    add esp, 4
    jmp exit_program

found:
    push found_msg
    call printf
    add esp, 4

exit_program:
    xor eax, eax
    ret


; ----------------------------------
; NEAR PROCEDURE: find_substring
; EAX = 1 if found, otherwise 0
; ----------------------------------

find_substring:
    mov esi, main_str

outer_loop:
    ; End of main string?
    cmp byte [esi], 0
    je substring_not_found

    mov edi, sub_str
    mov ebx, esi

inner_loop:
    ; End of substring means match
    cmp byte [edi], 0
    je substring_found

    ; Main string ended before substring
    cmp byte [ebx], 0
    je next_position

    ; Compare current characters
    mov al, [ebx]
    cmp al, [edi]
    jne next_position

    inc ebx
    inc edi
    jmp inner_loop

next_position:
    inc esi
    jmp outer_loop

substring_found:
    mov eax, 1
    ret

substring_not_found:
    xor eax, eax
    ret
