section .text
global main
main:
    extern printf
    section .data
        f1 dq "AND = %d",10,0
        f2 db "OR  = %d",10,0
        f3 db "XOR = %d",10,0
        f4 db "NOT = %d",10,0
    section .text
    ;AND
    sub rsp,40
        mov rax,64
        and rax,100
        mov rdx,rax
        mov rcx,f1
        call printf  
    add rsp,40
    
    ;OR
    sub rsp,40
        mov rax,64
        or rax,100
        mov rdx,rax
        mov rcx,f2
        call printf  
    add rsp,40
    
    ;XOR
    sub rsp,40
        mov rax,64
        xor rax,100
        mov rdx,rax
        mov rcx,f3
        call printf  
    add rsp,40
    
    ;NOT
    sub rsp,40
        mov rax,64
        not rax
        mov rdx,rax
        mov rcx,f4
        call printf  
    add rsp,40
    
    xor rax, rax
    ret