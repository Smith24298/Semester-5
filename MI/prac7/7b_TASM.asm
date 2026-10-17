.model small
.stack 100h
.data
    prompt db 'Enter an unsigned number (0-255): $'
    evenMsg db 13,10,'EVEN PARITY$'
    oddMsg  db 13,10,'ODD PARITY$'
.code
main proc
    mov ax,@data
    mov ds,ax
    lea dx,prompt
    mov ah,09h
    int 21h
    call read_num
    mov al,bl              ; read_num returns value in BX; input range 0-255
    xor dl,dl               ; count of set bits
count_bits:
    shr al,1
    jnc no_one
    inc dl
no_one:
    test al,al
    jnz count_bits
    test dl,1
    jz is_even
    lea dx,oddMsg
    jmp show_result
is_even:
    lea dx,evenMsg
show_result:
    mov ah,09h
    int 21h
    mov ax,4C00h
    int 21h
main endp

; Read unsigned decimal number until Enter, result in BX.
read_num proc
    xor bx,bx
rd_digit:
    mov ah,01h
    int 21h
    cmp al,13
    je rd_done
    cmp al,'0'
    jb rd_digit
    cmp al,'9'
    ja rd_digit
    sub al,'0'
    xor ah,ah
    push ax
    mov ax,bx
    mov cx,10
    mul cx
    mov bx,ax
    pop ax
    add bx,ax
    jmp rd_digit
rd_done:
    ret
read_num endp
end main
