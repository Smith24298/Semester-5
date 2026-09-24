class Color:
    RED = "RED"
    BLACK = "BLACK"


class Node:
    def __init__(self, data, color=Color.RED):
        self.data = data
        self.color = color
        self.left = None
        self.right = None
        self.parent = None


class RedBlackTree:

    def __init__(self):
        # Sentinel NIL node
        self.NIL = Node(None, Color.BLACK)
        self.NIL.left = self.NIL
        self.NIL.right = self.NIL
        self.NIL.parent = self.NIL

        self.root = self.NIL

    # ---------------------------------------------------------
    # LEFT ROTATION
    # ---------------------------------------------------------
    def left_rotate(self, x):

        y = x.right
        x.right = y.left

        if y.left != self.NIL:
            y.left.parent = x

        y.parent = x.parent

        if x.parent == self.NIL:
            self.root = y

        elif x == x.parent.left:
            x.parent.left = y

        else:
            x.parent.right = y

        y.left = x
        x.parent = y

    # ---------------------------------------------------------
    # RIGHT ROTATION
    # ---------------------------------------------------------
    def right_rotate(self, x):

        y = x.left
        x.left = y.right

        if y.right != self.NIL:
            y.right.parent = x

        y.parent = x.parent

        if x.parent == self.NIL:
            self.root = y

        elif x == x.parent.right:
            x.parent.right = y

        else:
            x.parent.left = y

        y.right = x
        x.parent = y

    # ---------------------------------------------------------
    # INSERT
    # ---------------------------------------------------------
    def insert(self, data):

        new_node = Node(data, Color.RED)

        new_node.left = self.NIL
        new_node.right = self.NIL

        parent = self.NIL
        current = self.root

        while current != self.NIL:

            parent = current

            if data < current.data:
                current = current.left
            else:
                current = current.right

        new_node.parent = parent

        if parent == self.NIL:
            self.root = new_node

        elif data < parent.data:
            parent.left = new_node

        else:
            parent.right = new_node

        self.insert_fixup(new_node)

    # ---------------------------------------------------------
    # INSERT FIXUP
    # ---------------------------------------------------------
    def insert_fixup(self, z):

        while z.parent.color == Color.RED:

            if z.parent == z.parent.parent.left:

                uncle = z.parent.parent.right

                # Case 1
                if uncle.color == Color.RED:

                    z.parent.color = Color.BLACK
                    uncle.color = Color.BLACK
                    z.parent.parent.color = Color.RED

                    z = z.parent.parent

                else:

                    # Case 2
                    if z == z.parent.right:
                        z = z.parent
                        self.left_rotate(z)

                    # Case 3
                    z.parent.color = Color.BLACK
                    z.parent.parent.color = Color.RED

                    self.right_rotate(z.parent.parent)

            else:

                uncle = z.parent.parent.left

                # Case 1
                if uncle.color == Color.RED:

                    z.parent.color = Color.BLACK
                    uncle.color = Color.BLACK
                    z.parent.parent.color = Color.RED

                    z = z.parent.parent

                else:

                    # Case 2
                    if z == z.parent.left:
                        z = z.parent
                        self.right_rotate(z)

                    # Case 3
                    z.parent.color = Color.BLACK
                    z.parent.parent.color = Color.RED

                    self.left_rotate(z.parent.parent)

        self.root.color = Color.BLACK

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------
    def search(self, data):

        current = self.root

        while current != self.NIL:

            if data == current.data:
                return current

            elif data < current.data:
                current = current.left

            else:
                current = current.right

        return self.NIL

    # ---------------------------------------------------------
    # MINIMUM
    # ---------------------------------------------------------
    def minimum(self, node):

        while node.left != self.NIL:
            node = node.left

        return node

    # ---------------------------------------------------------
    # TRANSPLANT
    # ---------------------------------------------------------
    def transplant(self, u, v):

        if u.parent == self.NIL:
            self.root = v

        elif u == u.parent.left:
            u.parent.left = v

        else:
            u.parent.right = v

        v.parent = u.parent

    # =========================================================
    # DELETE
    # =========================================================

    def delete(self, data):

        z = self.search(data)

        if z == self.NIL:
            print("Node not found")
            return

        y = z
        original_color = y.color

        # -----------------------------------------------------
        # Node has no left child
        # -----------------------------------------------------
        if z.left == self.NIL:

            x = z.right
            self.transplant(z, z.right)

        # -----------------------------------------------------
        # Node has no right child
        # -----------------------------------------------------
        elif z.right == self.NIL:

            x = z.left
            self.transplant(z, z.left)

        # -----------------------------------------------------
        # Node has two children
        # -----------------------------------------------------
        else:

            y = self.minimum(z.right)
            original_color = y.color
            x = y.right

            if y.parent == z:

                x.parent = y

            else:

                self.transplant(y, y.right)

                y.right = z.right
                y.right.parent = y

            self.transplant(z, y)

            y.left = z.left
            y.left.parent = y

            y.color = z.color

        # -----------------------------------------------------
        # If removed node was BLACK,
        # Double Black problem occurs.
        # -----------------------------------------------------
        if original_color == Color.BLACK:

            self.delete_fixup(x)

    # =========================================================
    # DELETE FIXUP
    # =========================================================

    def delete_fixup(self, x):

        while x != self.root and x.color == Color.BLACK:

            # =================================================
            # x is LEFT child
            # =================================================
            if x == x.parent.left:

                sibling = x.parent.right

                # -------------------------------------------------
                # CASE 3
                #
                # sibling is BLACK
                # sibling's children are BLACK
                # -------------------------------------------------
                if (
                    sibling.color == Color.BLACK
                    and sibling.left.color == Color.BLACK
                    and sibling.right.color == Color.BLACK
                ):

                    print("Case 3")

                    # (a) Remove DB
                    # (b) Make sibling RED
                    sibling.color = Color.RED

                    # (c) Push Double Black to parent
                    if x.parent.color == Color.BLACK:
                        x = x.parent
                    else:
                        x.parent.color = Color.BLACK
                        break

                # -------------------------------------------------
                # CASE 4
                #
                # sibling is RED
                # -------------------------------------------------
                elif sibling.color == Color.RED:

                    print("Case 4")

                    # (a) Swap colors of parent and sibling
                    sibling.color = Color.BLACK
                    x.parent.color = Color.RED

                    # (b) Rotate at parent in direction of DB
                    self.left_rotate(x.parent)

                    # (c) New sibling
                    sibling = x.parent.right

                    # Now continue to Case 5/6
                    continue

                # -------------------------------------------------
                # CASE 5
                #
                # sibling BLACK
                # near child RED
                # far child BLACK
                # -------------------------------------------------
                elif (
                    sibling.color == Color.BLACK
                    and sibling.left.color == Color.RED
                    and sibling.right.color == Color.BLACK
                ):

                    print("Case 5")

                    # (a) Swap sibling color with near RED child
                    sibling.left.color = Color.BLACK
                    sibling.color = Color.RED

                    # (b) Rotate at sibling
                    self.right_rotate(sibling)

                    # New sibling
                    sibling = x.parent.right

                # -------------------------------------------------
                # CASE 6
                #
                # sibling BLACK
                # far child RED
                # -------------------------------------------------
                if (
                    sibling.color == Color.BLACK
                    and sibling.right.color == Color.RED
                ):

                    print("Case 6")

                    # (a) Swap parent color with sibling color
                    sibling.color = x.parent.color

                    # (b) Parent becomes BLACK
                    x.parent.color = Color.BLACK

                    # (c) Rotate at parent in direction of DB
                    self.left_rotate(x.parent)

                    # (d) Far RED child becomes BLACK
                    sibling.right.color = Color.BLACK

                    # Remove DB
                    x = self.root

            # =================================================
            # x is RIGHT child
            # =================================================
            else:

                sibling = x.parent.left

                # -------------------------------------------------
                # CASE 3
                # -------------------------------------------------
                if (
                    sibling.color == Color.BLACK
                    and sibling.left.color == Color.BLACK
                    and sibling.right.color == Color.BLACK
                ):

                    print("Case 3")

                    sibling.color = Color.RED

                    if x.parent.color == Color.BLACK:
                        x = x.parent
                    else:
                        x.parent.color = Color.BLACK
                        break

                # -------------------------------------------------
                # CASE 4
                # -------------------------------------------------
                elif sibling.color == Color.RED:

                    print("Case 4")

                    sibling.color = Color.BLACK
                    x.parent.color = Color.RED

                    self.right_rotate(x.parent)

                    sibling = x.parent.left

                    continue

                # -------------------------------------------------
                # CASE 5
                #
                # Near child is RED
                # For right DB, near child = sibling.right
                # -------------------------------------------------
                elif (
                    sibling.color == Color.BLACK
                    and sibling.right.color == Color.RED
                    and sibling.left.color == Color.BLACK
                ):

                    print("Case 5")

                    sibling.right.color = Color.BLACK
                    sibling.color = Color.RED

                    self.left_rotate(sibling)

                    sibling = x.parent.left

                # -------------------------------------------------
                # CASE 6
                #
                # Far child is RED
                # For right DB, far child = sibling.left
                # -------------------------------------------------
                if (
                    sibling.color == Color.BLACK
                    and sibling.left.color == Color.RED
                ):

                    print("Case 6")

                    sibling.color = x.parent.color
                    x.parent.color = Color.BLACK

                    self.right_rotate(x.parent)

                    sibling.left.color = Color.BLACK

                    x = self.root

        # Remove Double Black
        x.color = Color.BLACK

    # =========================================================
    # INORDER TRAVERSAL
    # =========================================================

    def inorder(self, node=None):

        if node is None:
            node = self.root

        if node == self.NIL:
            return

        self.inorder(node.left)

        print(
            f"{node.data}({node.color[0]})",
            end=" "
        )

        self.inorder(node.right)

    # =========================================================
    # PREORDER
    # =========================================================

    def preorder(self, node=None):

        if node is None:
            node = self.root

        if node == self.NIL:
            return

        print(
            f"{node.data}({node.color[0]})",
            end=" "
        )

        self.preorder(node.left)
        self.preorder(node.right)

    # =========================================================
    # PRINT TREE
    # =========================================================

    def print_tree(self, node=None, space=0):

        if node is None:
            node = self.root

        if node == self.NIL:
            return

        space += 5

        self.print_tree(node.right, space)

        print()

        print(" " * space, end="")
        print(f"{node.data} ({node.color})")

        self.print_tree(node.left, space)


# =============================================================
# DRIVER CODE
# =============================================================

if __name__ == "__main__":

    tree = RedBlackTree()

    values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]

    for value in values:
        tree.insert(value)

    print("\nInitial Tree:")
    tree.print_tree()

    print("\n\nInorder:")
    tree.inorder()

    # ---------------------------------------------------------
    # DELETE
    # ---------------------------------------------------------

    print("\n\nDeleting 10...")
    tree.delete(10)

    print("\nTree after deletion:")
    tree.print_tree()

    print("\n\nInorder:")
    tree.inorder()