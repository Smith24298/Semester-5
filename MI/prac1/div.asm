section .text
global main
main:
    extern printf
    section .data
    f1 db "Q = %d",10,0
    f2 db "R = %d",10,0
    
    section .text
    mov eax,20
    cdq
    mov ecx,5
    idiv ecx
    
    
    mov ebx,edx
    push eax
    push f1
    call printf
    add esp,8
    
    push ebx
    push f2
    call printf
    add esp,8
    
    xor eax, eax
    ret