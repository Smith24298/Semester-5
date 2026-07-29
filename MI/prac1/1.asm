section .text
global main
main:
    extern printf
    section .data
    m1 db "HELLLOOO"," my name is",10,"Smith",10,0
    m2 db "hollaaa",10,0
    m3 db "konichiwa",10,0
    section .text
    main:
    push m1
    call printf
    add esp,4
    push m2
    call printf
    add esp,4
    push m3
    call printf
    add esp,4 
    xor eax, eax
    ret