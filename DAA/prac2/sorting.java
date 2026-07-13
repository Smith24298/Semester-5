import java.util.Arrays;
import java.util.Random;



class sorting{

    static void bubbleSort(int[] arr){
        for(int i = 0;i < arr.length-1;i++){
            for(int j=i;j<arr.length-1;j++){
                if(arr[j] > arr[j+1]){
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }

    static void selectionSort(int[] arr){
        for (int i=0;i<arr.length-1;i++){
            int minIndex = i;
            for(int j=i+1;j<arr.length;j++){
                if(arr[j] < arr[minIndex]){
                    minIndex = j;
                }
            }
            int temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }

    static void insertionSort(int[] arr){
        for(int i=1;i<arr.length;i++){
            int key = arr[i];
            int j = i-1;
            while(j>=0 && arr[j]>key){
                arr[j+1] = arr[j];
                j--;
            }
            arr[j+1] = key;
        }
    }

    static void recursiveBubbleSort(int[] arr,int n){
        if (n==1) return;
        for(int i=0;i<n-1;i++){
            if(arr[i] > arr[i+1]){
                int temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
            }
        }
        recursiveBubbleSort(arr, n-1);
    }

    static void recursiveSelectionSort(int[] arr,int n){
        if(n==1) return;
        int minIndex = 0;
        for(int i=1;i<n;i++){
            if(arr[i]<arr[minIndex]){
                minIndex = i;
            }
        }
        int temp = arr[minIndex];
        arr[minIndex] = arr[n-1];
        arr[n-1] = temp;
        recursiveSelectionSort(arr, n-1);
    }

    static void recursiveInsertionSort(int[] arr,int n){
        if(n<=1) return;
        recursiveInsertionSort(arr, n-1);
        int key = arr[n-1];
        int j = n-2;
        while(j>=0 && arr[j]>key){
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    public static void main(String[] args) {
        Random rand = new Random();
        int[] arr100 = new int[100];
        for (int i =0;i<100;i++){
            arr100[i] = rand.nextInt(1000);
        }
        int[] arr1000 = new int[1000];
        for (int i =0;i<1000;i++){
            arr1000[i] = rand.nextInt(1000);
        }

        
        long startTime = System.nanoTime();
        bubbleSort(Arrays.copyOf(arr100, arr100.length));
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        // System.out.println("Sorted array of 100 elements using Bubble Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length)));
        System.out.println("Time taken by Bubble Sort: " + duration + " nanoseconds");
        

        long startTime2 = System.nanoTime();
        selectionSort(Arrays.copyOf(arr100, arr100.length));
        long endTime2 = System.nanoTime();
        long duration2 = endTime2 - startTime2;
        // System.out.println("Sorted array of 100 elements using Selection Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length)));
        System.out.println("Time taken by Selection Sort: " + duration2 + " nanoseconds");


        long startTime3 = System.nanoTime();
        insertionSort(Arrays.copyOf(arr100, arr100.length));
        long endTime3 = System.nanoTime();
        long duration3 = endTime3 - startTime3;
        // System.out.println("Sorted array of 100 elements using Insertion Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length)));
        System.out.println("Time taken by Insertion Sort: " + duration3 + " nanoseconds");

        int[] result1000 = Arrays.copyOf(arr1000, arr1000.length);
        long startTime4 = System.nanoTime();
        bubbleSort(result1000);
        long endTime4 = System.nanoTime();
        long duration4 = endTime4 - startTime4;
        // System.out.println("Sorted array of 1000 elements using Bubble Sort: " + Arrays.toString(Arrays.copyOf(result1000, result1000.length)));
        System.out.println("Time taken by Bubble Sort: " + duration4 + " nanoseconds");


        long startTime5 = System.nanoTime();
        selectionSort(result1000);
        long endTime5 = System.nanoTime();
        long duration5 = endTime5 - startTime5;
        // System.out.println("Sorted array of 1000 elements using Selection Sort: " + Arrays.toString(Arrays.copyOf(result1000, result1000.length)));
        System.out.println("Time taken by Selection Sort: " + duration5 + " nanoseconds");



        long startTime6 = System.nanoTime();
        insertionSort(result1000);
        long endTime6 = System.nanoTime();
        long duration6 = endTime6 - startTime6;
        // System.out.println("Sorted array of 1000 elements using Insertion Sort: " + Arrays.toString(Arrays.copyOf(result1000, result1000.length)));
        System.out.println("Time taken by Insertion Sort: " + duration6 + " nanoseconds");


        long startTime7 = System.nanoTime();
        recursiveBubbleSort(Arrays.copyOf(arr100, arr100.length), arr100.length);
        long endTime7 = System.nanoTime();
        long duration7 = endTime7 - startTime7;
        // System.out.println("Sorted array of 100 elements using Recursive Bubble Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length)));
        System.out.println("Time taken by Recursive Bubble Sort: " + duration7 + " nanoseconds");


        long startTime8 = System.nanoTime();
        recursiveSelectionSort(Arrays.copyOf(arr100, arr100.length), arr100.length);
        long endTime8 = System.nanoTime();
        long duration8 = endTime8 - startTime8;
        // System.out.println("Sorted array of 100 elements using Recursive Selection Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length)));
        System.out.println("Time taken by Recursive Selection Sort: " + duration8 + " nanoseconds");


        long startTime9 = System.nanoTime();
        recursiveInsertionSort(Arrays.copyOf(arr100, arr100.length), arr100.length);
        long endTime9 = System.nanoTime();
        long duration9 = endTime9 - startTime9;
        // System.out.println("Sorted array of 100 elements using Recursive Insertion Sort: " + Arrays.toString(Arrays.copyOf(arr100, arr100.length))); 
        System.out.println("Time taken by Recursive Insertion Sort: " + duration9 + " nanoseconds");


        long startTime10 = System.nanoTime();
        recursiveBubbleSort(Arrays.copyOf(arr1000, arr1000.length), arr1000.length);
        long endTime10 = System.nanoTime(); 
        long duration10 = endTime10 - startTime10;
        // System.out.println("Sorted array of 1000 elements using Recursive Bubble Sort: " + Arrays.toString(Arrays.copyOf(arr1000, arr1000.length)));
        System.out.println("Time taken by Recursive Bubble Sort: " + duration10 + " nanoseconds");


        long startTime11 = System.nanoTime();
        recursiveSelectionSort(Arrays.copyOf(arr1000, arr1000.length), arr1000.length);
        long endTime11 = System.nanoTime();
        long duration11 = endTime11 - startTime11;
        // System.out.println("Sorted array of 1000 elements using Recursive Selection Sort: " + Arrays.toString(Arrays.copyOf(arr1000, arr1000.length)));
        System.out.println("Time taken by Recursive Selection Sort: " + duration11 + " nanoseconds");


        long startTime12 = System.nanoTime();
        recursiveInsertionSort(Arrays.copyOf(arr1000, arr1000.length), arr1000.length);
        long endTime12 = System.nanoTime();
        long duration12 = endTime12 - startTime12;
        // System.out.println("Sorted array of 1000 elements using Recursive Insertion Sort: " + Arrays.toString(Arrays.copyOf(arr1000, arr1000.length)));
        System.out.println("Time taken by Recursive Insertion Sort: " + duration12 + " nanoseconds");
    }
}