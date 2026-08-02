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
    
    ; Maximum of two numbers
    numMax1 dd 25
    numMax2 dd 18
    fmtMax db "Maximum : %d",10,0
    fmtMin db "Minimum : %d",10,0
    
    ; Rotate Operations
    rotNum dd 170
    fmtROL db "ROL : %d",10,0
    fmtROR db "ROR : %d",10,0
    
    section .text
    
    main:
    
        push ebp
        mov ebp, esp
    
    ; ---------------------------------
    ; 16-bit Binary Arithmetic
    ; ---------------------------------
    
        mov ax, [num16_1]
        add ax, [num16_2]
        movzx eax, ax
    
        push eax
        push fmt16add
        call printf
        add esp, 8
    
        mov ax, [num16_1]
        sub ax, [num16_2]
        movzx eax, ax
    
        push eax
        push fmt16sub
        call printf
        add esp, 8
    
    ; ---------------------------------
    ; 32-bit Binary Arithmetic
    ; ---------------------------------
    
        mov eax, [num32_1]
        add eax, [num32_2]
    
        push eax
        push fmt32add
        call printf
        add esp, 8
    
        mov eax, [num32_1]
        sub eax, [num32_2]
    
        push eax
        push fmt32sub
        call printf
        add esp, 8
    
    ; ---------------------------------
    ; Logical Operations
    ; ---------------------------------
    
        ; AND
        mov eax, [num32_1]
        and eax, [num32_2]
    
        push eax
        push fmtAND
        call printf
        add esp, 8
    
        ; OR
        mov eax, [num32_1]
        or eax, [num32_2]
    
        push eax
        push fmtOR
        call printf
        add esp, 8
    
        ; XOR
        mov eax, [num32_1]
        xor eax, [num32_2]
    
        push eax
        push fmtXOR
        call printf
        add esp, 8
    
        ; NOT
        mov eax, [num32_1]
        not eax
    
        push eax
        push fmtNOT
        call printf
        add esp, 8
    
    ; ---------------------------------
    ; Shift Operations
    ; ---------------------------------
    
        ; SHL
        mov eax, [num32_1]
        shl eax, 1
    
        push eax
        push fmtSHL
        call printf
        add esp, 8
    
        ; SHR
        mov eax, [num32_1]
        shr eax, 1
    
        push eax
        push fmtSHR
        call printf
        add esp, 8
    
    ; ---------------------------------
    ; Maximum of Two Numbers
    ; ---------------------------------
    
        mov eax,[numMax1]
        cmp eax,[numMax2]
        jge printMax
    
        mov eax,[numMax2]
    
    printMax:
    
        push eax
        push fmtMax
        call printf
        add esp,8
        
    ; ---------------------------------
    ; Minimum of Two Numbers
    ; ---------------------------------
    
        mov eax, [numMax1]
        cmp eax, [numMax2]
        jle printMin       
    
        mov eax, [numMax2] 
    
    printMin:
    
        push eax
        push fmtMin
        call printf
        add esp, 8
    
        
    
    ; ---------------------------------
    ; Rotate Left
    ; ---------------------------------
    
        mov eax,[rotNum]
        rol eax,1
    
        push eax
        push fmtROL
        call printf
        add esp,8
        
    
    ; ---------------------------------
    ; Rotate Right
    ; ---------------------------------
    
        mov eax,[rotNum]
        ror eax,1
    
        push eax
        push fmtROR
        call printf
        add esp,8
        
        
    
    ; ---------------------------------
    ; Exit
    ; ---------------------------------
    
        mov esp, ebp
        pop ebp
    
        xor eax, eax
        ret