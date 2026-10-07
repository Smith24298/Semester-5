import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Binomial Heap implementation in Java.
 *
 * Supported operations:
 * 1. Insert
 * 2. Get minimum
 * 3. Extract minimum
 * 4. Union / Meld
 * 5. Decrease key
 * 6. Delete key
 * 7. Search
 * 8. Display heap
 */
public class BinomialHeap {

    // Node of a binomial tree
    static class Node {
        int key;
        int degree;
        Node parent;
        Node child;
        Node sibling;

        Node(int key) {
            this.key = key;
            this.degree = 0;
        }
    }

    private Node head;

    // -------------------- INSERT --------------------

    public void insert(int key) {
        BinomialHeap temp = new BinomialHeap();
        temp.head = new Node(key);
        head = union(this, temp).head;
    }

    // -------------------- MINIMUM --------------------

    public int getMin() {
        if (head == null) {
            throw new IllegalStateException("Heap is empty.");
        }

        Node current = head;
        int min = current.key;

        while (current != null) {
            if (current.key < min) {
                min = current.key;
            }
            current = current.sibling;
        }

        return min;
    }

    // -------------------- EXTRACT MINIMUM --------------------

    public int extractMin() {
        if (head == null) {
            throw new IllegalStateException("Heap is empty.");
        }

        // Find minimum root and its previous root
        Node minNode = head;
        Node minPrev = null;

        Node prev = null;
        Node current = head;

        while (current != null) {
            if (current.key < minNode.key) {
                minNode = current;
                minPrev = prev;
            }
            prev = current;
            current = current.sibling;
        }

        // Remove minNode from root list
        if (minPrev == null) {
            head = minNode.sibling;
        } else {
            minPrev.sibling = minNode.sibling;
        }

        // Reverse children of minimum node
        Node child = minNode.child;
        Node reversedChildren = null;

        while (child != null) {
            Node next = child.sibling;

            child.parent = null;
            child.sibling = reversedChildren;
            reversedChildren = child;

            child = next;
        }

        // Create heap from reversed children
        BinomialHeap childHeap = new BinomialHeap();
        childHeap.head = reversedChildren;

        // Union remaining heap with children heap
        head = union(this, childHeap).head;

        minNode.parent = null;
        minNode.child = null;
        minNode.sibling = null;

        return minNode.key;
    }

    // -------------------- UNION / MELD --------------------

    public static BinomialHeap union(BinomialHeap h1, BinomialHeap h2) {
        BinomialHeap result = new BinomialHeap();

        result.head = mergeRootLists(h1.head, h2.head);

        if (result.head == null) {
            return result;
        }

        Node prev = null;
        Node current = result.head;
        Node next = current.sibling;

        while (next != null) {

            if (current.degree != next.degree ||
                    (next.sibling != null &&
                            next.sibling.degree == current.degree)) {

                prev = current;
                current = next;

            } else if (current.key <= next.key) {

                current.sibling = next.sibling;
                linkTrees(next, current);

            } else {

                if (prev == null) {
                    result.head = next;
                } else {
                    prev.sibling = next.sibling;
                }

                linkTrees(current, next);
                current = next;
            }

            next = current.sibling;
        }

        return result;
    }

    // Merge root lists ordered by degree
    private static Node mergeRootLists(Node h1, Node h2) {
        if (h1 == null) return h2;
        if (h2 == null) return h1;

        Node newHead;

        if (h1.degree <= h2.degree) {
            newHead = h1;
            h1 = h1.sibling;
        } else {
            newHead = h2;
            h2 = h2.sibling;
        }

        Node tail = newHead;

        while (h1 != null && h2 != null) {
            if (h1.degree <= h2.degree) {
                tail.sibling = h1;
                h1 = h1.sibling;
            } else {
                tail.sibling = h2;
                h2 = h2.sibling;
            }

            tail = tail.sibling;
        }

        tail.sibling = (h1 != null) ? h1 : h2;

        return newHead;
    }

    // Make y a child of z
    private static void linkTrees(Node y, Node z) {
        y.parent = z;
        y.sibling = z.child;
        z.child = y;
        z.degree++;
    }

    // -------------------- SEARCH --------------------

    public Node search(int key) {
        return search(head, key);
    }

    private Node search(Node root, int key) {
        if (root == null) {
            return null;
        }

        if (root.key == key) {
            return root;
        }

        Node found = search(root.child, key);

        if (found != null) {
            return found;
        }

        return search(root.sibling, key);
    }

    // -------------------- DECREASE KEY --------------------

    public void decreaseKey(int oldKey, int newKey) {
        if (newKey > oldKey) {
            throw new IllegalArgumentException(
                    "New key must be <= old key."
            );
        }

        Node node = search(oldKey);

        if (node == null) {
            throw new IllegalArgumentException(
                    "Key " + oldKey + " not found."
            );
        }

        decreaseKey(node, newKey);
    }

    private void decreaseKey(Node node, int newKey) {
        node.key = newKey;

        Node current = node;
        Node parent = current.parent;

        while (parent != null && current.key < parent.key) {
            int temp = current.key;
            current.key = parent.key;
            parent.key = temp;

            current = parent;
            parent = current.parent;
        }
    }

    // -------------------- DELETE --------------------

    public void delete(int key) {
        Node node = search(key);

        if (node == null) {
            throw new IllegalArgumentException(
                    "Key " + key + " not found."
            );
        }

        // Move the key to -infinity / Integer.MIN_VALUE
        decreaseKey(node, Integer.MIN_VALUE);

        extractMin();
    }

    // -------------------- DISPLAY --------------------

    public void display() {
        if (head == null) {
            System.out.println("Heap is empty.");
            return;
        }

        System.out.println("\nBinomial Heap:");

        Node current = head;

        while (current != null) {
            System.out.println(
                    "\nBinomial Tree B" + current.degree + ":"
            );

            printTree(current, "", true);

            current = current.sibling;
        }
    }

    private void printTree(Node node, String indent, boolean last) {
        if (node == null) return;

        System.out.println(
                indent +
                (last ? "└── " : "├── ") +
                node.key
        );

        List<Node> children = new ArrayList<>();

        Node child = node.child;

        while (child != null) {
            children.add(child);
            child = child.sibling;
        }

        for (int i = 0; i < children.size(); i++) {
            printTree(
                    children.get(i),
                    indent + (last ? "    " : "│   "),
                    i == children.size() - 1
            );
        }
    }

    // -------------------- SIZE --------------------

    public int size() {
        return size(head);
    }

    private int size(Node node) {
        if (node == null) return 0;

        int count = 0;
        Node current = node;

        while (current != null) {
            count += size(current.child);
            count++;
            current = current.sibling;
        }

        return count;
    }

    // -------------------- MAIN / MENU --------------------

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        BinomialHeap heap = new BinomialHeap();

        while (true) {

            System.out.println("\n=================================");
            System.out.println("       BINOMIAL HEAP");
            System.out.println("=================================");
            System.out.println("1. Insert");
            System.out.println("2. Get Minimum");
            System.out.println("3. Extract Minimum");
            System.out.println("4. Decrease Key");
            System.out.println("5. Delete");
            System.out.println("6. Search");
            System.out.println("7. Display");
            System.out.println("8. Size");
            System.out.println("9. Union / Meld");
            System.out.println("0. Exit");
            System.out.println("=================================");

            System.out.print("Enter choice: ");

            int choice;

            try {
                choice = Integer.parseInt(sc.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input.");
                continue;
            }

            try {

                switch (choice) {

                    case 1:
                        System.out.print("Enter key: ");
                        int key = Integer.parseInt(sc.nextLine());

                        heap.insert(key);

                        System.out.println(
                                "Inserted " + key + "."
                        );
                        break;

                    case 2:
                        System.out.println(
                                "Minimum = " + heap.getMin()
                        );
                        break;

                    case 3:
                        System.out.println(
                                "Extracted Minimum = "
                                        + heap.extractMin()
                        );
                        break;

                    case 4:
                        System.out.print("Enter old key: ");
                        int oldKey = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter new key: ");
                        int newKey = Integer.parseInt(sc.nextLine());

                        heap.decreaseKey(oldKey, newKey);

                        System.out.println(
                                "Key decreased successfully."
                        );
                        break;

                    case 5:
                        System.out.print("Enter key to delete: ");
                        int deleteKey =
                                Integer.parseInt(sc.nextLine());

                        heap.delete(deleteKey);

                        System.out.println(
                                "Deleted " + deleteKey + "."
                        );
                        break;

                    case 6:
                        System.out.print("Enter key to search: ");
                        int searchKey =
                                Integer.parseInt(sc.nextLine());

                        Node result = heap.search(searchKey);

                        if (result != null) {
                            System.out.println(
                                    "Key " + searchKey + " found."
                            );
                        } else {
                            System.out.println(
                                    "Key " + searchKey + " not found."
                            );
                        }
                        break;

                    case 7:
                        heap.display();
                        break;

                    case 8:
                        System.out.println(
                                "Size = " + heap.size()
                        );
                        break;

                    case 9:
                        System.out.print(
                                "Enter number of elements for second heap: "
                        );

                        int n =
                                Integer.parseInt(sc.nextLine());

                        BinomialHeap secondHeap =
                                new BinomialHeap();

                        System.out.println(
                                "Enter " + n + " elements:"
                        );

                        for (int i = 0; i < n; i++) {
                            secondHeap.insert(
                                    Integer.parseInt(sc.nextLine())
                            );
                        }

                        heap = union(heap, secondHeap);

                        System.out.println(
                                "Heaps merged successfully."
                        );
                        break;

                    case 0:
                        System.out.println("Exiting...");
                        sc.close();
                        return;

                    default:
                        System.out.println(
                                "Invalid choice."
                        );
                }

            } catch (Exception e) {
                System.out.println(
                        "Error: " + e.getMessage()
                );
            }
        }
    }
}
