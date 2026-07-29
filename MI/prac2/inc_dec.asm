section .text
global main
main:
    extern printf
    extern scanf
    section .data
    f1 db "THE INCREMENTED VALUE IS %d",10,0
    f3 db"%d",0
    f2 db "THE DECREMENTED VALUE IS %d",10,0
    
    section .bss
    num resq 1
    
    section .text
    push num
    push f3
    call scanf
    add esp,8
    
    mov eax,[num]
    inc eax
    push eax
    mov ebx,eax
    push f1
    call printf
    add esp,8
    
    dec ebx
    push ebx
    push f2
    call printf
    add esp,8
    
    xor eax, eax
    ret