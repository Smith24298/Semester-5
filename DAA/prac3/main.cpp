#include <iostream>

enum Color
{
    RED,
    BLACK
};

struct Node
{
    int data;
    Color color;
    Node *left, *right, *parent;

    Node(int val) : data(val), color(RED), left(nullptr), right(nullptr), parent(nullptr) {}
};

class RedBlackTree
{
private:
    Node *root;
    Node *NIL;

    void leftRotate(Node *x)
    {
        Node *y = x->right;
        x->right = y->left;
        if (y->left != NIL)
            y->left->parent = x;
        y->parent = x->parent;
        if (x->parent == nullptr)
            root = y;
        else if (x == x->parent->left)
            x->parent->left = y;
        else
            x->parent->right = y;
        y->left = x;
        x->parent = y;
    }

    void rightRotate(Node *x)
    {
        Node *y = x->left;
        x->left = y->right;
        if (y->right != NIL)
            y->right->parent = x;
        y->parent = x->parent;
        if (x->parent == nullptr)
            root = y;
        else if (x == x->parent->right)
            x->parent->right = y;
        else
            x->parent->left = y;
        y->right = x;
        x->parent = y;
    }

    void fixInsert(Node *k)
    {
        Node *u;
        while (k->parent->color == RED)
        {
            if (k->parent == k->parent->parent->right)
            {
                u = k->parent->parent->left; // Uncle
                if (u->color == RED)
                {
                    // Case 1: Uncle is RED
                    u->color = BLACK;
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    k = k->parent->parent;
                }
                else
                {
                    if (k == k->parent->left)
                    {
                        // Case 2: Uncle is BLACK & node is Left child (Right-Left)
                        k = k->parent;
                        rightRotate(k);
                    }
                    // Case 3: Uncle is BLACK & node is Right child (Right-Right)
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    leftRotate(k->parent->parent);
                }
            }
            else
            {
                u = k->parent->parent->right; // Uncle
                if (u->color == RED)
                {
                    // Case 1: Uncle is RED
                    u->color = BLACK;
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    k = k->parent->parent;
                }
                else
                {
                    if (k == k->parent->right)
                    {
                        // Case 2: Uncle is BLACK & node is Right child (Left-Right)
                        k = k->parent;
                        leftRotate(k);
                    }
                    // Case 3: Uncle is BLACK & node is Left child (Left-Left)
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    rightRotate(k->parent->parent);
                }
            }
            if (k == root)
                break;
        }
        root->color = BLACK;
    }

    void rbTransplant(Node *u, Node *v)
    {
        if (u->parent == nullptr)
            root = v;
        else if (u == u->parent->left)
            u->parent->left = v;
        else
            u->parent->right = v;
        v->parent = u->parent;
    }

    void fixDelete(Node *x)
    {
        Node *s;
        while (x != root && x->color == BLACK)
        {
            if (x == x->parent->left)
            {
                s = x->parent->right; // Sibling
                if (s->color == RED)
                {
                    // Case 1: Sibling is RED
                    s->color = BLACK;
                    x->parent->color = RED;
                    leftRotate(x->parent);
                    s = x->parent->right;
                }

                if (s->left->color == BLACK && s->right->color == BLACK)
                {
                    // Case 2: Sibling and both sibling's children are BLACK
                    s->color = RED;
                    x = x->parent;
                }
                else
                {
                    if (s->right->color == BLACK)
                    {
                        // Case 3: Sibling's right child is BLACK, left is RED
                        s->left->color = BLACK;
                        s->color = RED;
                        rightRotate(s);
                        s = x->parent->right;
                    }
                    // Case 4: Sibling's right child is RED
                    s->color = x->parent->color;
                    x->parent->color = BLACK;
                    s->right->color = BLACK;
                    leftRotate(x->parent);
                    x = root;
                }
            }
            else
            {
                s = x->parent->left; // Sibling
                if (s->color == RED)
                {
                    // Case 1: Sibling is RED
                    s->color = BLACK;
                    x->parent->color = RED;
                    rightRotate(x->parent);
                    s = x->parent->left;
                }

                if (s->right->color == BLACK && s->left->color == BLACK)
                {
                    // Case 2: Sibling and both sibling's children are BLACK
                    s->color = RED;
                    x = x->parent;
                }
                else
                {
                    if (s->left->color == BLACK)
                    {
                        // Case 3: Sibling's left child is BLACK, right is RED
                        s->right->color = BLACK;
                        s->color = RED;
                        leftRotate(s);
                        s = x->parent->left;
                    }
                    // Case 4: Sibling's left child is RED
                    s->color = x->parent->color;
                    x->parent->color = BLACK;
                    s->left->color = BLACK;
                    rightRotate(x->parent);
                    x = root;
                }
            }
        }
        x->color = BLACK;
    }

    Node *minimum(Node *node)
    {
        while (node->left != NIL)
            node = node->left;
        return node;
    }

    void inorderHelper(Node *node)
    {
        if (node != NIL)
        {
            inorderHelper(node->left);
            std::cout << node->data << "(" << (node->color == RED ? "R" : "B") << ") ";
            inorderHelper(node->right);
        }
    }

public:
    RedBlackTree()
    {
        NIL = new Node(0);
        NIL->color = BLACK;
        root = NIL;
    }

    void insert(int key)
    {
        Node *node = new Node(key);
        node->parent = nullptr;
        node->left = NIL;
        node->right = NIL;
        node->color = RED;

        Node *y = nullptr;
        Node *x = root;

        while (x != NIL)
        {
            y = x;
            if (node->data < x->data)
                x = x->left;
            else
                x = x->right;
        }

        node->parent = y;
        if (y == nullptr)
            root = node;
        else if (node->data < y->data)
            y->left = node;
        else
            y->right = node;

        if (node->parent == nullptr)
        {
            node->color = BLACK;
            return;
        }

        if (node->parent->parent == nullptr)
            return;

        fixInsert(node);
    }

    void remove(int key)
    {
        Node *z = root;
        Node *x, *y;
        while (z != NIL)
        {
            if (z->data == key)
                break;
            if (z->data < key)
                z = z->right;
            else
                z = z->left;
        }

        if (z == NIL)
            return; // Key not found

        y = z;
        Color yOriginalColor = y->color;

        if (z->left == NIL)
        {
            x = z->right;
            rbTransplant(z, z->right);
        }
        else if (z->right == NIL)
        {
            x = z->left;
            rbTransplant(z, z->left);
        }
        else
        {
            y = minimum(z->right);
            yOriginalColor = y->color;
            x = y->right;
            if (y->parent == z)
            {
                x->parent = y;
            }
            else
            {
                rbTransplant(y, y->right);
                y->right = z->right;
                y->right->parent = y;
            }
            rbTransplant(z, y);
            y->left = z->left;
            y->left->parent = y;
            y->color = z->color;
        }

        delete z;

        if (yOriginalColor == BLACK)
        {
            fixDelete(x);
        }
    }

    void printInorder()
    {
        inorderHelper(root);
        std::cout << "\n";
    }
};

int main()
{
    RedBlackTree rbt;
    rbt.insert(10);
    rbt.insert(20);
    rbt.insert(30);
    rbt.insert(15);

    std::cout << "Inorder Traversal after Insertion:\n";
    rbt.printInorder();

    rbt.remove(20);
    std::cout << "Inorder Traversal after Deleting 20:\n";
    rbt.printInorder();

    return 0;
}