

REG8 = {
    "AL": "000",
    "CL": "001",
    "DL": "010",
    "BL": "011",
    "AH": "100",
    "CH": "101",
    "DH": "110",
    "BH": "111"
}

REG16 = {
    "AX": "000",
    "CX": "001",
    "DX": "010",
    "BX": "011",
    "SP": "100",
    "BP": "101",
    "SI": "110",
    "DI": "111"
}



MEMORY = {
    "BX+SI": "000",
    "BX+DI": "001",
    "BP+SI": "010",
    "BP+DI": "011",
    "SI":    "100",
    "DI":    "101",
    "BP":    "110",
    "BX":    "111"
}




def get_number(value):

    value = value.strip().upper()

    # Hexadecimal: 10H, 1234H
    if value.endswith("H"):
        return int(value[:-1], 16)

    # Decimal
    return int(value)


# ------------------------------------------------------------
# CONVERT DISPLACEMENT TO BINARY
# ------------------------------------------------------------

def displacement_bits(value, size):

    value = get_number(value)

    if size == 8:
        return format(value & 0xFF, "08b")

    else:
        return format(value & 0xFFFF, "016b")


# ------------------------------------------------------------
# PRINT COMMON FIELDS
# ------------------------------------------------------------

def print_fields(opcode, d, w, mod, reg, rm, displacement=""):

    print("\nBinary Instruction Fields")
    print("-------------------------")

    print("Opcode : ", opcode)
    print("D      : ", d)
    print("W      : ", w)
    print("MOD    : ", mod)
    print("REG    : ", reg)
    print("R/M    : ", rm)

    if displacement:
        print("DISP   : ", displacement)
    else:
        print("DISP   : None")

    print("\nComplete Binary:")

    print(
        opcode +
        d +
        w +
        mod +
        reg +
        rm +
        displacement
    )




def register_to_register(dest, src):

    # Both 8-bit
    if dest in REG8 and src in REG8:

        w = "0"

        reg = REG8[dest]
        rm = REG8[src]

    # Both 16-bit
    elif dest in REG16 and src in REG16:

        rm = REG16[src]

    else:

        print("\nError: Register sizes do not match.")
        return

    opcode = "100010"

    # Destination is register
    d = "1"

    # MOD = 11 means register-to-register
    mod = "11"

    print_fields(
        opcode,
        d,
        w, 
        mod,
        reg,
        rm
    )



def get_memory_info(memory):

    memory = memory.replace("[", "")
    memory = memory.replace("]", "")
    memory = memory.replace(" ", "")
    memory = memory.upper()

    # ----------------------------
    # CASE 1:                     #
    # BX+SI
    # BX+DI
    # BP+SI
    # BP+DI
    # ---------------------------

    if memory in MEMORY:

        rm = MEMORY[memory]

        return "00", rm, ""


    # --------------------------------------------------------
    # CASE 2:
    # BX+SI+DISPLACEMENT
    # Example:
    # [BX+SI+10]
    # --------------------------------------------------------

    parts = memory.split("+")

    if len(parts) == 3:

        address = parts[0] + "+" + parts[1]
        displacement = parts[2]

        if address in MEMORY:

            rm = MEMORY[address]

            disp = displacement_bits(
                displacement,
                8
            )

            return "01", rm, disp


    # --------------------------------------------------------
    # CASE 3:
    # REGISTER + DISPLACEMENT
    # Example:
    # [BX+10]
    # [SI+20]
    # --------------------------------------------------------

    if len(parts) == 2:

        first = parts[0]
        second = parts[1]

        # Check if first + second is a valid
        # register-register addressing mode

        address = first + "+" + second

        if address in MEMORY:

            rm = MEMORY[address]

            return "00", rm, ""

        # Otherwise it is register + displacement

        if first in MEMORY:

            rm = MEMORY[first]

            disp = displacement_bits(
                second,
                8
            )

            return "01", rm, disp


    # --------------------------------------------------------
    # CASE 4:
    # REGISTER - DISPLACEMENT
    # Example:
    # [BX-10]
    # --------------------------------------------------------

    if "-" in memory:

        parts = memory.split("-")

        if len(parts) == 2:

            base = parts[0]
            value = parts[1]

            if base in MEMORY:

                rm = MEMORY[base]

                number = -get_number(value)

                disp = displacement_bits(
                    number,
                    8
                )

                return "01", rm, disp


    # --------------------------------------------------------
    # CASE 5:
    # SIMPLE MEMORY
    # Example:
    # [BX]
    # [SI]
    # [DI]
    # [BP]
    # --------------------------------------------------------

    if memory in MEMORY:

        rm = MEMORY[memory]

        # [BP] is special.
        # MOD = 00, R/M = 110 means direct address.
        # Therefore [BP] needs MOD=01 with disp=00.

        if memory == "BP":

            return "01", rm, "00000000"

        return "00", rm, ""


    # --------------------------------------------------------
    # CASE 6:
    # DIRECT MEMORY ADDRESS
    # Example:
    # [1234H]
    # --------------------------------------------------------

    try:

        value = get_number(memory)

        # Direct address uses:
        # MOD = 00
        # R/M = 110
        # 16-bit displacement

        displacement = displacement_bits(
            value,
            16
        )

        return "00", "110", displacement

    except:

        return None, None, None


# ============================================================
# MEMORY TO REGISTER
#
# Example:
# MOV AX, [BX]
# MOV AX, [BX+SI]
# MOV AX, [BX+10]
# ============================================================

def memory_to_register(dest, src):

    # Determine W bit

    if dest in REG8:

        w = "0"
        reg = REG8[dest]

    elif dest in REG16:

        w = "1"
        reg = REG16[dest]

    else:

        print("\nError: Invalid destination register.")
        return


    mod, rm, displacement = get_memory_info(src)


    if mod is None:

        print("\nError: Invalid memory address.")
        return


    opcode = "100010"

    # Memory → Register
    d = "1"


    print_fields(
        opcode,
        d,
        w,
        mod,
        reg,
        rm,
        displacement
    )


# ============================================================
# REGISTER TO MEMORY
#
# Example:
# MOV [BX], AX
# MOV [BX+SI], AX
# MOV [BX+10], AX
# ============================================================

def register_to_memory(dest, src):

    # Determine W and REG

    if src in REG8:

        w = "0"
        reg = REG8[src]

    elif src in REG16:

        w = "1"
        reg = REG16[src]

    else:

        print("\nError: Invalid source register.")
        return


    mod, rm, displacement = get_memory_info(dest)


    if mod is None:

        print("\nError: Invalid memory address.")
        return


    opcode = "100010"

    # Register → Memory
    d = "0"


    print_fields(
        opcode,
        d,
        w,
        mod,
        reg,
        rm,
        displacement
    )


# ============================================================
# IMMEDIATE TO REGISTER
#
# Example:
# MOV AX, 10
# MOV AL, 20
# ============================================================

def immediate_to_register(dest, value):

    if dest in REG8:

        w = "0"
        reg = REG8[dest]

        immediate = displacement_bits(
            value,
            8
        )

    elif dest in REG16:

        w = "1"
        reg = REG16[dest]

        immediate = displacement_bits(
            value,
            16
        )

    else:

        print("\nError: Invalid register.")
        return


    # MOV immediate to register opcode
    # 1011 W REG

    opcode = "1011"


    print("\nBinary Instruction Fields")
    print("-------------------------")

    print("Opcode : ", opcode)
    print("W      : ", w)
    print("REG    : ", reg)
    print("Immediate :", immediate)

    print("\nComplete Binary:")

    print(
        opcode +
        w +
        reg +
        immediate
    )


# ============================================================
# IMMEDIATE TO MEMORY
#
# Example:
# MOV [BX], 10
# ============================================================

def immediate_to_memory(dest, value):

    mod, rm, displacement = get_memory_info(dest)


    if mod is None:

        print("\nError: Invalid memory address.")
        return


    # We assume BYTE immediate
    # W = 0

    opcode = "1100011"
    w = "0"

    # REG field is 000 for MOV immediate
    reg = "000"


    immediate = displacement_bits(
        value,
        8
    )


    print("\nBinary Instruction Fields")
    print("-------------------------")

    print("Opcode : ", opcode)
    print("W      : ", w)
    print("MOD    : ", mod)
    print("REG    : ", reg)
    print("R/M    : ", rm)

    if displacement:

        print("DISP   : ", displacement)

    else:

        print("DISP   : None")

    print("Immediate :", immediate)


    print("\nComplete Binary:")

    print(
        opcode +
        w +
        mod +
        reg +
        rm +
        displacement +
        immediate
    )


# ============================================================
# PROCESS MOV INSTRUCTION
# ============================================================

def process_instruction(instruction):

    instruction = instruction.upper().strip()


    # --------------------------------------------------------
    # Check MOV
    # --------------------------------------------------------

    if not instruction.startswith("MOV "):

        print("\nError: Please enter a MOV instruction.")

        return


    # Remove MOV

    instruction = instruction[4:]


    # --------------------------------------------------------
    # Check comma
    # --------------------------------------------------------

    if "," not in instruction:

        print("\nError: Invalid MOV instruction.")

        return


    # Split destination and source

    dest, src = instruction.split(",", 1)

    dest = dest.strip()
    src = src.strip()


    # ========================================================
    # MEMORY TO MEMORY
    # ========================================================

    if "[" in dest and "[" in src:

        print(
            "\nError: Memory-to-Memory MOV "
            "is NOT allowed in 8086."
        )

        return


    # ========================================================
    # DESTINATION IS REGISTER
    # ========================================================

    if dest in REG8 or dest in REG16:


        # ----------------------------------------------------
        # REGISTER TO REGISTER
        # ----------------------------------------------------

        if src in REG8 or src in REG16:

            register_to_register(
                dest,
                src
            )

            return


        # ----------------------------------------------------
        # MEMORY TO REGISTER
        # ----------------------------------------------------

        if "[" in src:

            memory_to_register(
                dest,
                src
            )

            return


        # ----------------------------------------------------
        # IMMEDIATE TO REGISTER
        # ----------------------------------------------------

        try:

            immediate_to_register(
                dest,
                src
            )

            return

        except:

            print("\nError: Invalid source.")

            return


    # ========================================================
    # DESTINATION IS MEMORY
    # ========================================================

    if "[" in dest:


        # ----------------------------------------------------
        # REGISTER TO MEMORY
        # ----------------------------------------------------

        if src in REG8 or src in REG16:

            register_to_memory(
                dest,
                src
            )

            return


        # ----------------------------------------------------
        # IMMEDIATE TO MEMORY
        # ----------------------------------------------------

        try:

            immediate_to_memory(
                dest,
                src
            )

            return

        except:

            print("\nError: Invalid immediate value.")

            return


    # ========================================================
    # INVALID
    # ========================================================

    print("\nError: Invalid MOV instruction.")


# ============================================================
# MAIN PROGRAM
# ============================================================

print()
print("==============================================")
print("      8086 MOV INSTRUCTION GENERATOR")
print("==============================================")

print()
print("Examples:")
print("MOV AX, BX")
print("MOV AL, BL")
print("MOV AX, [BX]")
print("MOV AX, [BX+SI]")
print("MOV AX, [BX+10]")
print("MOV [BX], AX")
print("MOV [BX+SI], AX")
print("MOV AX, 10")
print("MOV AL, 20")
print("MOV [BX], 10")
print()
print("Type EXIT to stop the program.")
print()


# Infinite loop

while True:

    instruction = input(
        "Enter MOV instruction: "
    )


    # Exit

    if instruction.upper().strip() == "EXIT":

        print("\nProgram terminated.")

        break


    # Process instruction

    process_instruction(instruction)
