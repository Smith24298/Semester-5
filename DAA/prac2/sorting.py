"""
Sorting algorithm benchmark: Bubble, Selection, Insertion sort
(iterative + recursive variants), timed across best / average / worst
case inputs for a range of array sizes. Produces one comparison graph
per algorithm variant (best vs average vs worst case).
"""

import sys
import time
import random
import statistics

import matplotlib.pyplot as plt

sys.setrecursionlimit(10000)


# ---------------------------------------------------------------------------
# Sorting algorithms (ports of the Java versions)
# ---------------------------------------------------------------------------

def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(i, n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]


def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[min_index], arr[i] = arr[i], arr[min_index]


def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key


def recursive_bubble_sort(arr, n):
    if n == 1:
        return
    for i in range(n - 1):
        if arr[i] > arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
    recursive_bubble_sort(arr, n - 1)


def recursive_selection_sort(arr, n):
    if n == 1:
        return
    min_index = 0
    for i in range(1, n):
        if arr[i] < arr[min_index]:
            min_index = i
    arr[min_index], arr[n - 1] = arr[n - 1], arr[min_index]
    recursive_selection_sort(arr, n - 1)


def recursive_insertion_sort(arr, n):
    if n <= 1:
        return
    recursive_insertion_sort(arr, n - 1)
    key = arr[n - 1]
    j = n - 2
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key


ALGORITHMS = {
    "Bubble Sort": lambda arr: bubble_sort(arr),
    "Selection Sort": lambda arr: selection_sort(arr),
    "Insertion Sort": lambda arr: insertion_sort(arr),
    "Recursive Bubble Sort": lambda arr: recursive_bubble_sort(arr, len(arr)),
    "Recursive Selection Sort": lambda arr: recursive_selection_sort(arr, len(arr)),
    "Recursive Insertion Sort": lambda arr: recursive_insertion_sort(arr, len(arr)),
}


# ---------------------------------------------------------------------------
# Input generators for best / average / worst cases
# ---------------------------------------------------------------------------

def best_case(n):
    # Already sorted ascending -> best case for all three algorithms
    return list(range(n))


def worst_case(n):
    # Reverse sorted -> worst case for all three algorithms
    return list(range(n, 0, -1))


def average_case(n):
    return [random.randint(0, 10_000) for _ in range(n)]


# ---------------------------------------------------------------------------
# Benchmarking
# ---------------------------------------------------------------------------

def time_run(func, arr):
    data = arr[:]  # copy, since sorts are in-place
    start = time.perf_counter()
    func(data)
    return time.perf_counter() - start


def benchmark(sizes, trials_avg=3):
    """
    Returns: results[algo_name][case_name] = list of times (seconds), aligned with `sizes`
    """
    results = {name: {"Best": [], "Average": [], "Worst": []} for name in ALGORITHMS}

    for n in sizes:
        print(f"Benchmarking size {n}...")
        best_arr = best_case(n)
        worst_arr = worst_case(n)

        for name, func in ALGORITHMS.items():
            # Best case
            t_best = time_run(func, best_arr)
            results[name]["Best"].append(t_best)

            # Worst case
            t_worst = time_run(func, worst_arr)
            results[name]["Worst"].append(t_worst)

            # Average case: average over several random trials
            avg_times = []
            for _ in range(trials_avg):
                rand_arr = average_case(n)
                avg_times.append(time_run(func, rand_arr))
            results[name]["Average"].append(statistics.mean(avg_times))

    return results


# ---------------------------------------------------------------------------
# Plotting
# ---------------------------------------------------------------------------

def plot_results(results, sizes, outdir="plots"):
    colors = {"Best": "#2ca02c", "Average": "#1f77b4", "Worst": "#d62728"}

    for name, cases in results.items():
        plt.figure(figsize=(8, 5))
        for case_name, times in cases.items():
            plt.plot(
                sizes,
                times,
                marker="o",
                label=f"{case_name} case",
                color=colors[case_name],
            )
        plt.title(f"{name}: Best vs Average vs Worst Case")
        plt.xlabel("Array size (n)")
        plt.ylabel("Time (seconds)")
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()

        filename = f"{outdir}/{name.replace(' ', '_').lower()}.png"
        plt.savefig(filename, dpi=150)
        plt.close()
        print(f"Saved {filename}")


if __name__ == "__main__":
    
    sizes = [500, 1000, 2000, 3000, 5000, 7000, 9000]

    results = benchmark(sizes, trials_avg=3)
    plot_results(results, sizes)

    print("\nSummary (seconds):")
    for name, cases in results.items():
        print(f"\n{name}")
        print(f"{'n':>6} {'Best':>10} {'Average':>10} {'Worst':>10}")
        for i, n in enumerate(sizes):
            print(
                f"{n:>6} {cases['Best'][i]:>10.5f} {cases['Average'][i]:>10.5f} {cases['Worst'][i]:>10.5f}"
            )