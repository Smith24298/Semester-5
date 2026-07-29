section .text
global main
main:
    extern printf
    section .data
    f1 db "Sum = %d",10,0
    f2 db "diff = %d",10,0
    f3 db "Mul = %d",10,0
    f4 db "DIV = %d",10,0
    section .text
    ;addition
    sub rsp,40
    mov rdx,5
    add rdx,7
    mov rcx,f1
    call printf
    
    ;subraction
    mov rdx,7
    sub rdx,5
    mov rcx,f2
    call printf
    
    ;multiplication
    mov rax,5
    imul rax,7
    mov rdx,rax
    mov rcx,f3
    call printf
    
    ;division
    mov rax,35
    xor rdx,rdx
    mov rbx,5
    div rbx
    mov rdx,rax
    mov rcx,f4
    call printf
    
    add rsp,40    
    xor eax, eax
    ret