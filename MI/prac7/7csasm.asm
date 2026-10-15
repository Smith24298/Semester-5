section .data

num db "123654",0

msg1 db "String to Integer = %d",10,0
msg2 db "Integer to String = %s",10,0


section .bss

buffer resb 20


section .text

global main
extern printf


main:

    push num
    call str_to_int
    add esp,4

    ; Save integer
    mov ebx,eax

    ; Print integer
    push ebx
    push msg1
    call printf
    add esp,8


    push buffer
    push ebx
    call int_to_str
    add esp,8

    ; Print string
    push buffer
    push msg2
    call printf
    add esp,8


    xor eax,eax
    ret


str_to_int:

    push ebp
    mov ebp,esp

    mov esi,[ebp+8]

    xor eax,eax


next_digit:

    mov bl,[esi]

    test bl,bl
    jz str_done

    imul eax,10

    sub bl,'0'

    movzx ebx,bl

    add eax,ebx

    inc esi

    jmp next_digit


str_done:

    pop ebp
    ret

int_to_str:

    push ebp
    mov ebp,esp

    mov eax,[ebp+8]
    mov edi,[ebp+12]

    mov ebx,10

    ; Check for zero
    test eax,eax
    jnz convert


    mov byte [edi],'0'
    mov byte [edi+1],0
    jmp int_done


convert:

    add edi,19
    mov byte [edi],0


divide:

    xor edx,edx

    div ebx

    add dl,'0'

    dec edi

    mov [edi],dl

    test eax,eax
    jnz divide


    ; Copy string to beginning

    mov esi,edi
    mov edi,[ebp+12]


copy:

    mov al,[esi]

    mov [edi],al

    inc esi
    inc edi

    test al,al
    jnz copy


int_done:

    pop ebp
    ret