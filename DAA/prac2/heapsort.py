"""
Heapsort implementation + empirical runtime benchmark for
best / worst / average case inputs across several sizes.
"""

import random
import time
import copy
import matplotlib.pyplot as plt


# ----------------------------------------------------------------------
# 1. Heapsort implementation
# ----------------------------------------------------------------------
def heapify(arr, n, i):
    """Sift the element at index i down to maintain the max-heap property
    for the subtree rooted at i, within arr[0:n]."""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)


def heapsort(arr):
    """Sorts arr in place, ascending order. O(n log n) in all cases."""
    n = len(arr)

    # Build a max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Repeatedly extract the max and rebuild the heap
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        heapify(arr, end, 0)

    return arr


# ----------------------------------------------------------------------
# 2. Input generators for the three "cases"
#    (Heapsort is Theta(n log n) in ALL cases theoretically -- the
#    build-heap phase is O(n) and each of the n extractions is
#    O(log n) regardless of input order. We still measure the three
#    classic input distributions empirically, since constant factors
#    do shift a little with input arrangement.)
# ----------------------------------------------------------------------
def best_case_input(n):
    # Already sorted ascending input
    return list(range(n))


def worst_case_input(n):
    # Reverse sorted input (forces maximum sift-down movement
    # while building the initial heap)
    return list(range(n, 0, -1))


def average_case_input(n):
    # Random permutation
    arr = list(range(n))
    random.shuffle(arr)
    return arr


# ----------------------------------------------------------------------
# 3. Benchmark
# ----------------------------------------------------------------------
def time_sort(generator, n, repeats=5):
    """Average wall-clock time (seconds) of heapsort over `repeats` runs."""
    total = 0.0
    for _ in range(repeats):
        arr = generator(n)
        start = time.perf_counter()
        heapsort(arr)
        total += time.perf_counter() - start
    return total / repeats


sizes = [500, 1000, 2000, 3000, 4000,5000]
cases = {
    "Best Case (sorted input)": best_case_input,
    "Worst Case (reverse sorted input)": worst_case_input,
    "Average Case (random input)": average_case_input,
}

results = {case_name: [] for case_name in cases}

print(f"{'n':>6} | {'Best (s)':>10} | {'Worst (s)':>10} | {'Average (s)':>12}")
print("-" * 48)
for n in sizes:
    row = []
    for case_name, generator in cases.items():
        t = time_sort(generator, n, repeats=7)
        results[case_name].append(t)
        row.append(t)
    print(f"{n:>6} | {row[0]:>10.5f} | {row[1]:>10.5f} | {row[2]:>12.5f}")

# ----------------------------------------------------------------------
# 4. Verify correctness (sanity check)
# ----------------------------------------------------------------------
test = [5, 2, 9, 1, 5, 6, 0, -3, 42]
assert heapsort(copy.deepcopy(test)) == sorted(test)
print("\nCorrectness check passed.")

# ----------------------------------------------------------------------
# 5. Plot
# ----------------------------------------------------------------------
plt.figure(figsize=(9, 6))
markers = {"Best Case (sorted input)": "o",
           "Worst Case (reverse sorted input)": "s",
           "Average Case (random input)": "^"}
colors = {"Best Case (sorted input)": "#2ecc71",
          "Worst Case (reverse sorted input)": "#e74c3c",
          "Average Case (random input)": "#3498db"}

for case_name, times in results.items():
    plt.plot(sizes, times, marker=markers[case_name],
              color=colors[case_name], linewidth=2, markersize=7,
              label=case_name)

plt.title("Heapsort Runtime vs Input Size (Best / Worst / Average Case)",
          fontsize=13, fontweight="bold")
plt.xlabel("Input Size (n)", fontsize=11)
plt.ylabel("Runtime (seconds, avg of 7 runs)", fontsize=11)
plt.xticks(sizes)
plt.grid(True, linestyle="--", alpha=0.5)
plt.legend(fontsize=10)
plt.tight_layout()
plt.savefig("plots/heapsort_benchmark.png", dpi=150)
print("\nPlot saved to heapsort_benchmark.png")