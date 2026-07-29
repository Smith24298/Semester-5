section .text
global main
main:
    extern printf
    section .data
    f1 db "Sum = %d",10,0
    
    section .text
    sub rsp,40
    mov rdx,5
    add rdx,7
    mov rcx,f1
    call printf
    add rsp,40
    
    xor eax, eax
    ret