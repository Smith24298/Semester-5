section .text
global main
main:
    extern printf
    section .data
    f1 db "MAXIMUM = %d",10,0
    
    section .text
    mov eax,50
    mov ebx,60
    cmp eax,ebx
    jc second ;to make minimum change to jnc
    
    push eax
    push f1
    call printf
    add esp,8
    jmp finish
    
    second:
    push ebx
    push f1
    call printf
    add esp,8
    finish:
    xor eax, eax
    ret