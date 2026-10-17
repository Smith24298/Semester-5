.model small
.stack 100h
.data
    prompt db 'Enter 5 numbers (one per line):',13,10,'$'
    sumMsg db 13,10,'Sum = $'
    avgMsg db 13,10,'Average = $'
    newline db 13,10,'$'
    nums dw 5 dup(?)
    sum dw 0
.code
main proc
    mov ax,@data
    mov ds,ax
    lea dx,prompt
    mov ah,09h
    int 21h
    lea si,nums
    mov cx,5
input_loop:
    push cx
    call read_num
    mov [si],ax
    add si,2
    pop cx
    loop input_loop

    mov word ptr sum,0
    lea si,nums
    mov cx,5
sum_loop:
    mov ax,[si]
    add sum,ax
    add si,2
    loop sum_loop

    lea dx,sumMsg
    mov ah,09h
    int 21h
    mov ax,sum
    call print_num

    lea dx,avgMsg
    mov ah,09h
    int 21h
    mov ax,sum
    xor dx,dx
    mov bx,5
    div bx
    call print_num

    mov ax,4C00h
    int 21h
main endp

; Read an unsigned decimal number until Enter. Result in AX.
read_num proc
    xor bx,bx
read_digit:
    mov ah,01h
    int 21h
    cmp al,13
    je read_done
    cmp al,'0'
    jb read_digit
    cmp al,'9'
    ja read_digit
    sub al,'0'
    xor ah,ah
    push ax
    mov ax,bx
    mov cx,10
    mul cx
    mov bx,ax
    pop ax
    add bx,ax
    jmp read_digit
read_done:
    mov ax,bx
    ret
read_num endp

; Print unsigned number in AX.
print_num proc
    push ax
    push bx
    push cx
    push dx
    xor cx,cx
    mov bx,10
    cmp ax,0
    jne pn_divide
    mov dl,'0'
    mov ah,02h
    int 21h
    jmp pn_done
pn_divide:
    xor dx,dx
    div bx
    push dx
    inc cx
    cmp ax,0
    jne pn_divide
pn_output:
    pop dx
    add dl,'0'
    mov ah,02h
    int 21h
    loop pn_output
pn_done:
    pop dx
    pop cx
    pop bx
    pop ax
    ret
print_num endp
end main
