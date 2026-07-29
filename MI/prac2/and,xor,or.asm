section .text
global main
main:
    extern printf
    section .data
    f1 db "AND = %d",10,0
    f2 db "OR  = %d",10,0
    f3 db "XOR = %d",10,0
    f4 db "NOT = %d",10,0
    
    section .text
    ;AND
    mov eax,64
    and eax,100
    push eax
    push f1
    call printf
    add esp,8
    
    ;OR
    mov eax,64
    or eax,100
    push eax
    push f2
    call printf
    add esp,8
    
    ;XOR
    mov eax,64
    xor eax,100
    push eax
    push f3
    call printf
    add esp,8
    
    ;NOT
    mov eax,64
    not eax
    push eax
    push f4
    call printf
    add esp,8
    
    
    xor eax, eax
    ret