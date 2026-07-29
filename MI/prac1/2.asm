section .text
global main
main:
    extern printf
    section .data
    m1 db "NIRMA UNIVERSITY",10,0
    
    section .text
    main:
    sub rsp,40
    
    mov rcx,m1
    call printf
    add rsp,40
    xor eax, eax
    ret
    
    ;40 bytes reserved in which 32 are shadow space 8 are alignment 
    