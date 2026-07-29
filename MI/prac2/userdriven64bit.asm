section .text
global main
main:
    extern printf
    extern scanf
    section .data
    f1 dq"GIVE ME YOUR NUMBERS IN INPUT",10,0
    f2 dq"%d",0
    f4 dq "   ",10,0
    f3 dq"ADDITION OF NUMBERS IS : %d",10,0
    section .bss
        num1 resq 1
        num2 resq 1
    section .text
    
    sub rsp,40
    
    mov rcx,f1
    call printf
    
    mov rdx,num1;taking num1
    mov rcx,f2
    call scanf
    
    mov rdx,num2;taking num2
    mov rcx,f2
    call scanf
    
    mov rcx,f4
    call printf
    
    mov rax,[num1];add
    add rax,[num2]
    mov rdx,rax
    mov rcx,f3
    call printf
    
    
    add rsp,40
    
    xor rax, rax
    ret