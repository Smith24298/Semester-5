global main
extern printf

section .data

; 16-bit numbers
num16_1 dw 1010b
num16_2 dw 0011b

; 32-bit numbers
num32_1 dd 10101010b
num32_2 dd 00110011b


fmt16add db "16-bit ADD : %d",10,0
fmt16sub db "16-bit SUB : %d",10,0

fmt32add db "32-bit ADD : %d",10,0
fmt32sub db "32-bit SUB : %d",10,0

fmtAND db "AND : %d",10,0
fmtOR  db "OR  : %d",10,0
fmtXOR db "XOR : %d",10,0
fmtNOT db "NOT : %d",10,0

fmtSHL db "SHL : %d",10,0
fmtSHR db "SHR : %d",10,0


section .text

main:


; -----------------------------
; 16-bit Binary Arithmetic
; -----------------------------

mov ax,[num16_1]
add ax,[num16_2]

movzx eax,ax

push eax
push fmt16add
call printf
add esp,8


mov ax,[num16_1]
sub ax,[num16_2]

movzx eax,ax

push eax
push fmt16sub
call printf
add esp,8



; -----------------------------
; 32-bit Binary Arithmetic
; -----------------------------

mov eax,[num32_1]
add eax,[num32_2]

push eax
push fmt32add
call printf
add esp,8



mov eax,[num32_1]
sub eax,[num32_2]

push eax
push fmt32sub
call printf
add esp,8



; -----------------------------
; Logical Operations
; -----------------------------

; AND

mov eax,[num32_1]
and eax,[num32_2]

push eax
push fmtAND
call printf
add esp,8



; OR

mov eax,[num32_1]
or eax,[num32_2]

push eax
push fmtOR
call printf
add esp,8



; XOR

mov eax,[num32_1]
xor eax,[num32_2]

push eax
push fmtXOR
call printf
add esp,8



; NOT

mov eax,[num32_1]
not eax

push eax
push fmtNOT
call printf
add esp,8



; -----------------------------
; Shift Operations
; -----------------------------


; Left Shift

mov eax,[num32_1]
shl eax,1

push eax
push fmtSHL
call printf
add esp,8



; Right Shift

mov eax,[num32_1]
shr eax,1

push eax
push fmtSHR
call printf
add esp,8



; Exit

mov eax,0
ret