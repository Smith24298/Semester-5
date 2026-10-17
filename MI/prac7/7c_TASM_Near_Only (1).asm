.model small
.stack 100h
.data
    num db '123654',0
    msg1 db 'String to Integer = $'
    msg2 db 13,10,'Integer to String = $'
    buffer db 7 dup('$')
    value dw 0
.code
main proc
    mov ax,@data
    mov ds,ax

    lea si,num
    xor ax,ax
convert_to_int:
    mov bl,[si]
    cmp bl,0
    je int_ready
    mov cx,10
    mul cx
    sub bl,'0'
    xor bh,bh
    add ax,bx
    inc si
    jmp convert_to_int
int_ready:
    mov value,ax
    lea dx,msg1
    mov ah,09h
    int 21h
    mov ax,value
    call print_num

    ; Convert integer to decimal text in buffer, then print it.
    mov ax,value
    lea di,buffer
    call int_to_str
    lea dx,msg2
    mov ah,09h
    int 21h
    lea dx,buffer
    mov ah,09h
    int 21h

    mov ax,4C00h
    int 21h
main endp

; AX unsigned number -> '$'-terminated decimal string at DS:DI.
int_to_str proc near
    push ax
    push bx
    push cx
    push dx
    push si
    add di,6
    mov byte ptr [di],'$'
    mov bx,10
    xor cx,cx
    cmp ax,0
    jne its_divide
    dec di
    mov byte ptr [di],'0'
    jmp its_copy
its_divide:
    xor dx,dx
    div bx
    add dl,'0'
    dec di
    mov [di],dl
    inc cx
    cmp ax,0
    jne its_divide
its_copy:
    ; Move generated digits to the beginning of buffer.
    mov si,di
    mov di,offset buffer
its_copy_loop:
    mov al,[si]
    mov [di],al
    inc si
    inc di
    cmp al,'$'
    jne its_copy_loop
    pop si
    pop dx
    pop cx
    pop bx
    pop ax
    ret
int_to_str endp

print_num proc near
    push ax
    push bx
    push cx
    push dx
    xor cx,cx
    mov bx,10
    cmp ax,0
    jne print_divide
    mov dl,'0'
    mov ah,02h
    int 21h
    jmp print_done
print_divide:
    xor dx,dx
    div bx
    push dx
    inc cx
    cmp ax,0
    jne print_divide
print_output:
    pop dx
    add dl,'0'
    mov ah,02h
    int 21h
    loop print_output
print_done:
    pop dx
    pop cx
    pop bx
    pop ax
    ret
print_num endp
end main
