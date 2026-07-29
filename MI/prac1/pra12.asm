global main
extern printf

section .data
    a db 20
    b db 5

    fmtAdd  db "ADD  : %d",10,0
    fmtSub  db "SUB  : %d",10,0
    fmtMul  db "MUL  : %d",10,0
    fmtIMul db "IMUL : %d",10,0
    fmtDiv  db "DIV  : Quo6tient = %d",10,0
    fmtCmp1 db "CMP  : a is Greater",10,0
    fmtCmp2 db "CMP  : a is Smaller",10,0
    fmtCmp3 db "CMP  : a is Equal",10,0
    fmtNeg  db "NEG  : %d",10,0
    fmtInc  db "INC  : %d",10,0
    fmtDec  db "DEC  : %d",10,0

section .text

main:
    mov ebp, esp; for correct debugging
    mov al, [a]
    add al, [b]
    movzx eax, al

    push eax
    push fmtAdd
    call printf
    add esp, 8

; SUB
    mov al, [a]
    sub al, [b]
    movzx eax, al

    push eax
    push fmtSub
    call printf
    add esp, 8
; MUL (Unsigned)
    mov al, [a]
    mov bl, [b]
    mul bl            
    movzx eax, ax

    push eax
    push fmtMul
    call printf
    add esp, 8
; IMUL (Signed)
    movsx eax, byte [a]
    movsx ebx, byte [b]
    imul eax, ebx

    push eax
    push fmtIMul
    call printf
    add esp, 8
; DIV (Unsigned)
    mov al, [a]
    xor ah, ah
    mov bl, [b]
    div bl            

    movzx eax, al

    push eax
    push fmtDiv
    call printf
    add esp, 8
; CMP
    mov al, [a]
    cmp al, [b]

    jg Greater
    jl Smaller

Equal:  
    push fmtCmp3
    call printf
    add esp, 4
    jmp NegPart

Greater:
    push fmtCmp1
    call printf
    add esp, 4
    jmp NegPart

Smaller:
    push fmtCmp2
    call printf
    add esp, 4
; NEG
NegPart:
    movsx eax, byte [a]
    neg eax

    push eax
    push fmtNeg
    call printf
    add esp, 8
; INC
    movzx eax, byte [a]
    inc eax

    push eax
    push fmtInc
    call printf
    add esp, 8

; DEC
    movzx eax, byte [a]
    dec eax

    push eax
    push fmtDec
    call printf
    add esp, 8

; Exit

    mov eax, 0
    ret