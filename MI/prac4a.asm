global main
extern printf
extern scanf

section .data

menu db "Select MOV Instruction:",10
     db "1. MOV AX, BX",10
     db "2. MOV CX, DX",10
     db "3. MOV AL, BL",10
     db "Enter your choice: ",10,0

fmt_in db "%d",0
fmt_out db "Machine Code : %s",10,0

choice dd 0

mc1 db "89 D8",0
mc2 db "89 D1",0
mc3 db "88 D8",0

section .text
main:

    push menu
    call printf
    add esp,4

    push choice
    push fmt_in
    call scanf
    add esp,8

    mov eax,[choice]

    cmp eax,1
    je option1

    cmp eax,2
    je option2

    cmp eax,3
    je option3

    mov eax,0
    ret

option1:
    push mc1
    push fmt_out
    call printf
    add esp,8
    jmp exit

option2:
    push mc2
    push fmt_out
    call printf
    add esp,8
    jmp exit

option3:
    push mc3
    push fmt_out
    call printf
    add esp,8

exit:
    mov eax,0
    ret