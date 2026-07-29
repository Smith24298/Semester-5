section .text
global main
main:
    extern printf
    extern scanf
    section .data
    f1 db "THE LEFT SHIFT IS %d",10,0
    f2 db "THE RIGHT SHIFT IS %d",10,0
    section .text
    mov eax,8
    mov ebx,eax
    shl eax,1
    push eax
    push f2
    call printf
    add esp,8
    
    shr ebx,1
    push ebx
    push f1
    call printf
    add esp,8
    
    xor eax, eax
    ret
    ;rol & ror circular shift
    ;sar & sal arithmatic shift 