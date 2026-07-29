section .text
global main
main:
    extern printf
    section .data
    f1 db "Sum = %d",10,0
    
    section .text
    mov eax,5
    add eax,7
    
    push eax
    push f1
    call printf
    add esp,8
    
    xor eax, eax
    ret