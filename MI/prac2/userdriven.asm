section .text
global main
main:
    extern printf
    extern scanf
    section .data
    f1 db"GIVE ME YOUR NUMBERS IN INPUT",10,0
    f2 db"%d",0
    f4 db "   ",10,0
    f3 db"ADDITION OF NUMBERS IS : %d",10,0
    section .bss
        num1 resq 1
        num2 resq 1
    section .text
    push f1
    call printf
    add esp,4
    
    push num1;taking num1
    push f2
    call scanf
    add esp,8
    
    push num2;taking num2
    push f2
    call scanf
    add esp,8
    
    push f4
    call printf
    add esp,4
    
    mov eax,[num1];add
    add eax,[num2]
    push eax
    push f3
    call printf
    add esp,8
    
    xor eax, eax
    ret