global main
extern printf

section .data
    fmt db "%s", 10,0
    str1 db "Hello World",0

section .text
main:
    mov ebp, esp

    push str1
    push fmt
    call printf

    add esp, 8
    mov eax, 0
    ret