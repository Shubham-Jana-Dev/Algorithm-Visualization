import React, { useState, useEffect, useCallback } from 'react';

// --- Constants ---
const DEFAULT_ARRAY_SIZE = 15;
const MAX_ARRAY_VALUE = 400; 
const MIN_ARRAY_VALUE = 10;
const ANIMATION_SPEED_MS = 80; 
const MAX_DISPLAY_HEIGHT_PX = 380; // Maximum height in pixels for the tallest bar

// --- Components (All components are defined here for the single-file mandate) ---

// 1. ArrayBar Component (FIXED: Added maxPossibleValue and fixed height calculation)
const ArrayBar = React.memo(({ value, height, width, isHighlighted, isPivot, isSorted, maxPossibleValue }) => {
    
    // Green: Sorted, Blue: Default, Orange: Highlighted (Comparison/Swap), Violet: Pivot/Current Minimum
    let color = '#007bff'; // Default Blue
    if (isSorted) {
        color = '#4CAF50'; // Green
    } else if (isPivot) {
        color = '#8A2BE2'; // BlueViolet
    } else if (isHighlighted) {
        color = '#FF5733'; // Orange
    }

    // Scale the value to the available display height.
    // Normalized Height = (Value / MAX_ARRAY_VALUE) * MAX_DISPLAY_HEIGHT_PX
    const scaledHeight = (value / maxPossibleValue) * MAX_DISPLAY_HEIGHT_PX;
    
    // Ensure finalWidth is at least 2px for visibility
    const finalWidth = width > 0 ? `${width}px` : '2px';

    return (
        <div 
            style={{
                // CRITICAL FIX: Use the scaledHeight here
                height: `${scaledHeight}px`,
                width: finalWidth,
                margin: '0 1px',
                backgroundColor: color,
                // Added transition for smoother movement
                transition: 'height 0.1s linear, background-color 0.1s linear', 
                borderRadius: '2px 2px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            title={`Value: ${value}`}
        >
            {/* Show value for larger bars */}
            {width > 15 && <span style={{ position: 'absolute', top: -20, color: '#333' }}>{value}</span>}
        </div>
    );
});

// --- Algorithm Pseudocode ---
const PSEUDOCODE = {
    bubblesort: [
        "function bubbleSort(array):",
        "  n = array.length",
        "  for i from 0 to n - 2:",
        "    for j from 0 to n - 2 - i:",
        "      // Compare & Highlight array[j] and array[j+1]",
        "      if array[j] > array[j+1]:",
        "        // Swap elements",
        "        swap(array[j], array[j+1])",
        "  return array"
    ],
    mergesort: [
        "function mergeSort(array):",
        "  if array.length <= 1: return array",
        "  mid = floor(array.length / 2)",
        "  left = mergeSort(array[0...mid])",
        "  right = mergeSort(array[mid...n])",
        "  return merge(left, right)",
        "",
        "function merge(left, right):",
        "  // Merging sub-arrays and placing back into the original array...",
        "  result = []",
        "  while left & right are not empty:",
        "    if left[0] <= right[0]:",
        "      result.push(left.shift())",
        "    else:",
        "      result.push(right.shift())",
        "  return result + left + right"
    ],
    quicksort: [
        "function quickSort(array, low, high):",
        "  if low < high:",
        "    // Partition the array",
        "    pi = partition(array, low, high)",
        "    // Recursively sort left and right sub-arrays",
        "    quickSort(array, low, pi - 1)",
        "    quickSort(array, pi + 1, high)",
        "",
        "function partition(array, low, high):",
        "  pivot = array[high] // Choose the last element as pivot",
        "  i = low - 1",
        "  for j from low to high - 1:",
        "    if array[j] < pivot:",
        "      i++",
        "      swap(array[i], array[j])",
        "  swap(array[i+1], array[high])",
        "  return i + 1"
    ],
    selectionsort: [ // ADDED SELECTION SORT PSEUDOCODE
        "function selectionSort(array):",
        "  n = array.length",
        "  for i from 0 to n - 2:",
        "    min_idx = i",
        "    // Find the minimum element in the unsorted subarray array[i...n-1]",
        "    for j from i + 1 to n - 1:",
        "      // Highlight comparison array[j] and array[min_idx]",
        "      if array[j] < array[min_idx]:",
        "        min_idx = j",
        "    // Swap the found minimum element with the first element of the unsorted part",
        "    if min_idx != i:",
        "      swap(array[i], array[min_idx])",
        "    // Mark array[i] as sorted",
        "  return array"
    ],
    insertionsort: [ // ADDED INSERTION SORT PSEUDOCODE
        "function insertionSort(array):",
        "  n = array.length",
        "  for i from 1 to n - 1:",
        "    key = array[i]",
        "    j = i - 1",
        "    // Compare key with elements in sorted sub-array",
        "    while j >= 0 and array[j] > key:",
        "      // Shift element right",
        "      array[j + 1] = array[j]",
        "      j--",
        "    // Place key in correct position",
        "    array[j + 1] = key",
        "  return array"
    ],
    shellsort: [
        "function shellSort(array):",
        "  n = array.length",
        "  gap = floor(n / 2)",
        "  while gap > 0:",
        "    // Perform gapped insertion sort",
        "    for i from gap to n - 1:",
        "      temp = array[i]",
        "      j = i",
        "      while j >= gap and array[j - gap] > temp:",
        "        // Shift elements (Highlight comparison and shift)",
        "        array[j] = array[j - gap]",
        "        j = j - gap",
        "      // Place temp (Highlight placement)",
        "      array[j] = temp",
        "    gap = floor(gap / 2) // Reduce the gap"
    ]
};

// --- Helper Functions ---
const generateRandomArray = (size) => {
    return Array.from({ length: size }, () => 
        Math.floor(Math.random() * (MAX_ARRAY_VALUE - MIN_ARRAY_VALUE + 1)) + MIN_ARRAY_VALUE
    );
};

const parseCustomArray = (inputString) => {
    const elements = inputString.split(',')
        .map(s => {
            const num = parseInt(s.trim());
            return isNaN(num) || num <= 0 ? null : Math.min(num, MAX_ARRAY_VALUE);
        })
        .filter(n => n !== null);
    return elements;
};

// --- CLIENT-SIDE SORTING LOGIC ---

/**
 * Generates steps for Bubble Sort visualization.
 */
const getBubbleSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];
    const n = array.length;
    let sortedIndices = [];

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            // 1. Highlight comparison
            steps.push({
                array: [...array], 
                highlight_indices: [j, j + 1], 
                action: `Comparing array[${j}] and array[${j + 1}]`,
                sorted_indices: [...sortedIndices]
            });

            if (array[j] > array[j + 1]) {
                // 2. Swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                steps.push({
                    array: [...array], 
                    highlight_indices: [j, j + 1], 
                    action: `Swapping ${array[j+1]} and ${array[j]}`, 
                    sorted_indices: [...sortedIndices]
                });
            }
        }
        
        // Mark the largest element of this pass as sorted
        if (n - 1 - i >= 0) {
            sortedIndices.push(n - 1 - i);
        }

        // If no two elements were swapped in the inner loop, the array is sorted
        if (!swapped) {
            // Mark remaining elements as sorted and break
            for (let k = 0; k < n - 1 - i; k++) {
                if (!sortedIndices.includes(k)) {
                     sortedIndices.push(k);
                }
            }
            break;
        }
    }

    // Final step: Mark all as sorted
    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    steps.push({
        array: [...array], 
        highlight_indices: [], 
        action: "Finished Bubble Sort",
        sorted_indices: finalSortedIndices
    });

    return steps;
};

/**
 * Generates steps for Merge Sort visualization.
 */
const getMergeSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];
    
    // Recursive Merge function that records steps
    const merge = (arr, start, mid, end) => {
        // Since we are working with the original array 'array', we use indices relative to it
        const left = arr.slice(start, mid);
        const right = arr.slice(mid, end);
        let i = 0, j = 0, k = start;

        // Step 1: Highlight the sub-array being merged
        steps.push({
            array: [...array],
            highlight_indices: Array.from({ length: end - start }, (_, idx) => start + idx),
            action: `Merging sub-arrays from index ${start} to ${end - 1}`,
            sorted_indices: []
        });

        while (i < left.length && j < right.length) {
            // Step 2: Comparison and placement
            if (left[i] <= right[j]) {
                array[k] = left[i];
                i++;
            } else {
                array[k] = right[j];
                j++;
            }
            k++;
            
            // Record step after each placement
            steps.push({
                array: [...array],
                highlight_indices: [k - 1], // Highlight the placed bar
                action: `Placing element at index ${k - 1}`,
                sorted_indices: []
            });
        }

        // Step 3: Handle remaining elements
        while (i < left.length) {
            array[k] = left[i];
            i++; k++;
            steps.push({
                array: [...array],
                highlight_indices: [k - 1],
                action: `Placing remaining element from left half at ${k - 1}`,
                sorted_indices: []
            });
        }
        while (j < right.length) {
            array[k] = right[j];
            j++; k++;
            steps.push({
                array: [...array],
                highlight_indices: [k - 1],
                action: `Placing remaining element from right half at ${k - 1}`,
                sorted_indices: []
            });
        }
        
        // Final coloring for the merged segment
        steps.push({
            array: [...array],
            highlight_indices: [],
            action: `Merged segment complete from index ${start} to ${end - 1}`,
            // We don't mark as sorted until the whole thing is done to avoid visual clutter
            sorted_indices: [] 
        });
    };

    const mergeSortHelper = (arr, start, end) => {
        if (end - start <= 1) return;
        
        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(arr, start, mid);
        mergeSortHelper(arr, mid, end);
        merge(arr, start, mid, end);
    };

    mergeSortHelper(array, 0, array.length);

    // Final step: Mark all as sorted
    const finalSortedIndices = Array.from({ length: array.length }, (_, i) => i);
    steps.push({
        array: [...array], 
        highlight_indices: [], 
        action: "Finished Merge Sort",
        sorted_indices: finalSortedIndices
    });
    
    return steps;
};


/**
 * Generates steps for Quick Sort visualization (Lomuto Partition Scheme).
 */
const getQuickSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];

    // Helper to record a step
    const recordStep = (action, highlight_indices = [], pivot_index = null, sorted_indices = []) => {
        steps.push({
            array: [...array],
            action: action,
            highlight_indices: highlight_indices,
            pivot_index: pivot_index,
            sorted_indices: [...sorted_indices]
        });
    };

    // Partition function (Lomuto)
    const partition = (arr, low, high, sortedIndices) => {
        const pivot = arr[high]; // Pivot is the last element
        let i = low - 1; // Index of smaller element

        recordStep(`Selecting pivot ${pivot} at index ${high}`, [], high, sortedIndices);

        for (let j = low; j <= high - 1; j++) {
            // Highlight comparison
            recordStep(`Comparing ${arr[j]} at ${j} with pivot ${pivot}`, [j], high, sortedIndices);
            
            if (arr[j] < pivot) {
                i++;
                // Swap arr[i] and arr[j]
                [arr[i], arr[j]] = [arr[j], arr[i]];
                
                // Highlight swap
                recordStep(`Swapping ${arr[i]} at ${i} and ${arr[j]} at ${j}`, [i, j], high, sortedIndices);
            }
        }

        // Swap arr[i+1] and arr[high] (put pivot in correct position)
        const pivotIndex = i + 1;
        [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
        
        // Final placement of pivot
        recordStep(`Pivot ${pivot} placed correctly at index ${pivotIndex}`, [pivotIndex], null, [...sortedIndices, pivotIndex]);

        return pivotIndex;
    };

    const sortedIndicesTracker = [];

    // Recursive helper
    const quickSortHelper = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high, sortedIndicesTracker);

            // Add the placed pivot index to the tracker (it's permanently sorted)
            if (!sortedIndicesTracker.includes(pi)) {
                sortedIndicesTracker.push(pi);
            }

            // Recursive calls
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        } else if (low === high && low >= 0) {
            // Base case for single element array/sub-array
            if (!sortedIndicesTracker.includes(low)) {
                sortedIndicesTracker.push(low);
                recordStep(`Sub-array of size 1 at index ${low} is sorted.`, [], null, sortedIndicesTracker);
            }
        }
    };

    quickSortHelper(array, 0, array.length - 1);

    // Final step: Ensure all are marked as sorted
    const finalSortedIndices = Array.from({ length: array.length }, (_, i) => i);
    steps.push({
        array: [...array], 
        action: "Finished Quick Sort",
        highlight_indices: [],
        pivot_index: null,
        sorted_indices: finalSortedIndices
    });

    return steps;
};

/**
 * Generates steps for Selection Sort visualization.
 */
const getSelectionSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];
    const n = array.length;
    let sortedIndices = [];

    // Helper to record a step
    const recordStep = (action, highlight_indices = [], min_idx_highlight = null, sorted_indices = []) => {
        steps.push({
            array: [...array],
            action: action,
            highlight_indices: highlight_indices,
            pivot_index: min_idx_highlight, // Reusing pivot_index to track the current minimum index
            sorted_indices: [...sorted_indices]
        });
    };

    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        
        // 1. Initial boundary setup and assumed minimum
        recordStep(`Starting pass ${i}. Boundary at index ${i}.`, [i], i, sortedIndices);

        for (let j = i + 1; j < n; j++) {
            
            // 2. Highlight comparison (current element j and current minimum min_idx)
            // Highlight j (the comparison index) and min_idx (the current minimum)
            recordStep(`Comparing ${array[j]} at ${j} with current minimum ${array[min_idx]} at ${min_idx}.`, [j], min_idx, sortedIndices);

            if (array[j] < array[min_idx]) {
                min_idx = j;
                // 3. New minimum found - update minimum highlight
                recordStep(`New minimum found: ${array[min_idx]} at index ${min_idx}.`, [j], min_idx, sortedIndices);
            }
        }

        // 4. Swap the found minimum element with the element at the current boundary (i)
        if (min_idx !== i) {
            recordStep(`Minimum ${array[min_idx]} found. Swapping with boundary element ${array[i]} at ${i}.`, [i, min_idx], null, sortedIndices);
            [array[i], array[min_idx]] = [array[min_idx], array[i]];
        } else {
            recordStep(`No swap needed. Element at boundary ${i} is already the minimum of the remaining array.`, [i], null, sortedIndices);
        }

        // 5. Mark index i as sorted
        sortedIndices.push(i);
        recordStep(`Element at index ${i} is now placed and sorted.`, [], null, sortedIndices);
    }
    
    // The last element (n-1) is automatically sorted
    if (!sortedIndices.includes(n - 1) && n > 0) {
        sortedIndices.push(n - 1);
    }


    // Final step: Mark all as sorted
    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    recordStep("Finished Selection Sort", [], null, finalSortedIndices);

    return steps;
};

/**
 * Generates steps for Insertion Sort visualization. (NEWLY ADDED)
 */
const getInsertionSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];
    const n = array.length;
    
    // Helper to record a step
    const recordStep = (action, highlight_indices = [], pivot_index = null, sorted_until = 0) => {
        // Normalize sorted indices based on sorted_until length
        const sortedIndices = Array.from({ length: sorted_until }, (_, i) => i);
        steps.push({
            array: [...array],
            action: action,
            highlight_indices: highlight_indices,
            pivot_index: pivot_index, // Used for the key element being inserted
            sorted_until: sorted_until,
            sorted_indices: sortedIndices
        });
    };

    // Initial state
    recordStep("Initial state: Starting Insertion Sort. Index 0 is considered sorted.", [], null, 1);

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;

        // 1. Pick the key to insert
        recordStep(`Picking key ${key} at index ${i} to insert into sorted segment.`, [i], i, i);
        
        while (j >= 0 && key < array[j]) {
            // 2. Comparison and shift preparation
            recordStep(`Comparing key ${key} with ${array[j]} at index ${j}. Shifting right.`, [i, j], i, i);
            
            // 3. Perform the shift
            array[j + 1] = array[j];
            
            // 4. Record state after shift (showing the gap)
            recordStep(`Shifted ${array[j + 1]} to index ${j + 1}.`, [j + 1], i, i);
            
            j -= 1;
        }

        // 5. Insert the key into its correct position
        array[j + 1] = key;
        
        // 6. Insertion complete
        recordStep(`Key ${key} inserted at index ${j + 1}. Sorted segment extended to index ${i}.`, [j + 1], null, i + 1);
    }
    
    // Final step: Ensure all are marked as sorted
    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    recordStep("Finished Insertion Sort", [], null, n);

    return steps;
};


/**
 * Generates steps for Shell Sort visualization (using array halving gap).
 */
const getShellSortSteps = (initialArray) => {
    const array = [...initialArray];
    const steps = [];
    const n = array.length;
    let gap = Math.floor(n / 2);
    let sortedIndices = []; // Shell sort doesn't strictly mark elements as sorted until the end

    // Helper to record a step
    const recordStep = (action, highlight_indices = [], current_gap = gap, sorted_indices = []) => {
        steps.push({
            array: [...array],
            action: action,
            highlight_indices: highlight_indices,
            gap: current_gap,
            sorted_indices: [...sorted_indices]
        });
    };

    while (gap > 0) {
        recordStep(`Starting pass with Gap = ${gap}`, [], gap, sortedIndices);

        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j = i;

            // Highlight the element being inserted
            recordStep(`Selecting element ${temp} at index ${i}. Gap = ${gap}`, [i], gap, sortedIndices);

            // Inner Insertion Sort with a gap
            while (j >= gap && array[j - gap] > temp) {
                // 1. Highlight comparison
                recordStep(`Comparing ${array[j - gap]} at ${j - gap} and ${temp} (to be placed at ${j}). Gap = ${gap}`, [i, j - gap], gap, sortedIndices);
                
                // 2. Shift the element
                array[j] = array[j - gap];
                
                // 3. Highlight shift
                recordStep(`Shifting ${array[j - gap]} to ${j}. Gap = ${gap}`, [j], gap, sortedIndices);
                
                j -= gap;
            }
            
            // Place the element (temp) into its correct gapped position
            array[j] = temp;
            
            // 4. Highlight placement
            recordStep(`Placing ${temp} at index ${j}. Gap = ${gap}`, [j], gap, sortedIndices);
        }

        // Reduce the gap
        gap = Math.floor(gap / 2);
    }
    
    // Final step: Mark all as sorted
    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    recordStep("Finished Shell Sort", [], 0, finalSortedIndices);

    return steps;
};


function App() {
  // NEW STATE: Controls the current view ('sort' or 'bst')
  const [currentView, setCurrentView] = useState('sort'); 
    
  // Sorting Visualizer States
  const [steps, setSteps] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("insertionsort"); // Defaulting to Insertion Sort
  const [loadingError, setLoadingError] = useState(null);
  const [inputArray, setInputArray] = useState(() => generateRandomArray(DEFAULT_ARRAY_SIZE));
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [customInputData, setCustomInputData] = useState("");
  const [speed, setSpeed] = useState(ANIMATION_SPEED_MS);
  const [isPaused, setIsPaused] = useState(false);
  const [visualizerWidth, setVisualizerWidth] = useState(0); // State to hold the dynamic width

  // Derived States
  const currentStep = steps ? steps[currentStepIndex] : null;
  const currentArray = currentStep ? currentStep.array : inputArray;
  const highlightIndices = currentStep ? currentStep.highlight_indices : [];
  // pivotIndex is used for QuickSort (pivot), SelectionSort (current min index), and InsertionSort (key)
  const pivotIndex = currentStep ? currentStep.pivot_index : null; 
  // Selection/Bubble/Quick/Shell use 'sorted_indices'. Insertion uses 'sorted_until'. We normalize for the ArrayBar.
  const sortedIndices = currentStep 
    ? (currentStep.sorted_indices || (currentStep.sorted_until !== undefined ? Array.from({ length: currentStep.sorted_until }, (_, i) => i) : [])) 
    : [];
    
  const isSortingComplete = steps && currentStepIndex >= steps.length - 1 && sortedIndices.length === inputArray.length;
  const currentPseudocode = PSEUDOCODE[selectedAlgorithm];
  
  const SUPPORTED_ALGORITHMS = ["bubblesort", "mergesort", "quicksort", "shellsort", "selectionsort", "insertionsort"];
  const isSupportedAlgorithm = SUPPORTED_ALGORITHMS.includes(selectedAlgorithm);
  
  // Ref for the visualizer container to measure its width
  const visualizerRef = React.useRef(null);

  // --- Dynamic Bar Width Calculation ---
  const calculateBarWidth = useCallback(() => {
    if (!visualizerRef.current || currentArray.length === 0) return 0;
    
    // Get the actual available width of the container
    const availableWidth = visualizerRef.current.offsetWidth;
    const barCount = currentArray.length;

    // We use 2px margin per bar (1px on left, 1px on right)
    const totalMargin = barCount * 2; 
    
    // Calculated width per bar
    const calculatedWidth = (availableWidth - totalMargin) / barCount;
    
    // Ensure width is not negative or zero, setting a minimum of 2px
    return Math.max(2, calculatedWidth);
  }, [currentArray]);

  // Recalculate width on array change and on resize
  useEffect(() => {
    const updateWidth = () => {
      setVisualizerWidth(calculateBarWidth());
    };

    // Recalculate width when the component mounts or the array changes
    updateWidth(); 
    
    // Recalculate on window resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [currentArray, calculateBarWidth]);


  // --- Sorting Visualizer Helper Functions ---
  const handleGenerateNewArray = (size = arraySize) => {
      const newArray = generateRandomArray(size);
      setInputArray(newArray);
      setCustomInputData(""); 
      setArraySize(size);
  };
  
  const handleLoadCustomArray = () => {
      const newArray = parseCustomArray(customInputData);
      if (newArray.length > 0) {
          setInputArray(newArray);
          setArraySize(newArray.length); 
          setLoadingError(null);
      } else {
          setLoadingError("Invalid or empty custom array input. Please use comma-separated integers (e.g., 5,12,3,40).");
      }
  };

  const resetVisualizer = () => {
      setSteps(null);
      setCurrentStepIndex(0);
      setIsPaused(false);
      // Re-trigger step generation
      setInputArray([...inputArray]); 
  };


  // --- 1. Generate Data on Array/Algorithm Change (Sorting only) ---
  useEffect(() => {
    if (currentView !== 'sort' || inputArray.length === 0) return;
    
    // Clear steps/error before generation
    setSteps(null);
    setCurrentStepIndex(0);
    setLoadingError(null);
    setIsPaused(false);
    
    if (!isSupportedAlgorithm) {
        setLoadingError(`Algorithm ${selectedAlgorithm} is not yet supported for visualization.`);
        return; 
    }

    const cleanedArray = inputArray.map(val => Number(val));
    let newSteps = [];

    try {
        if (selectedAlgorithm === "bubblesort") {
            newSteps = getBubbleSortSteps(cleanedArray);
        } else if (selectedAlgorithm === "mergesort") {
            newSteps = getMergeSortSteps(cleanedArray);
        } else if (selectedAlgorithm === "quicksort") { 
            newSteps = getQuickSortSteps(cleanedArray);
        } else if (selectedAlgorithm === "selectionsort") { 
            newSteps = getSelectionSortSteps(cleanedArray);
        } else if (selectedAlgorithm === "insertionsort") {
            newSteps = getInsertionSortSteps(cleanedArray);
        } else if (selectedAlgorithm === "shellsort") { 
            newSteps = getShellSortSteps(cleanedArray);
        }
        
        if (newSteps && newSteps.length > 0) {
            setSteps(newSteps);
        } else {
             setLoadingError(`Algorithm ${selectedAlgorithm} resulted in an empty step list.`);
        }
        
    } catch (error) {
        // Log the error to the console for debugging
        console.error(`Algorithm Step Generation Failed for ${selectedAlgorithm}:`, error);
        setLoadingError(`Generation failed for ${selectedAlgorithm}: ${error.message}. Check console for details.`);
    }
    
  }, [selectedAlgorithm, inputArray, isSupportedAlgorithm, currentView]); 

  // --- 2. Animation Timer Logic (Sorting only) ---
  useEffect(() => {
    // CONDITION 1: Check if we are in the sort view
    if (currentView !== 'sort' || isPaused) return;
    
    // CONDITION 2: Check if steps data is loaded and sorting is not yet complete
    if (!steps || currentStepIndex >= steps.length - 1) return;

    const intervalId = setInterval(() => {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }, speed); // Use dynamic speed state

    return () => clearInterval(intervalId); 
    
  }, [steps, currentStepIndex, currentView, speed, isPaused]); // Animation relies on steps, index, view, and speed
    
  // --- Algorithm Options Structure ---
  const algorithmOptions = [
    { label: "--- Sorting Algorithms ---", value: "header-supported", disabled: true },
    { label: "Insertion Sort (O(n²))", value: "insertionsort" },
    { label: "Selection Sort (O(n²))", value: "selectionsort" },
    { label: "Bubble Sort (O(n²))", value: "bubblesort" },
    { label: "Shell Sort (O(n log² n))", value: "shellsort" },
    { label: "Merge Sort (O(n log n))", value: "mergesort" },
    { label: "Quick Sort (O(n log n))", value: "quicksort" },
    { label: "--- Search Algorithms ---", value: "header-search", disabled: true },
    { label: "Linear Search (O(n)) - COMING SOON", value: "linearsearch", disabled: true },
    { label: "Binary Search (O(log n)) - COMING SOON", value: "binarysearch", disabled: true },
  ];
  

  return (
    <div style={{ padding: '20px', minWidth: '800px', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

      {/* HEADER */}
      <h1 style={{ fontSize: '2em', color: '#333', marginBottom: '20px' }}>Algorithm Visualizer</h1>

      {/* VIEW TOGGLE BUTTONS (Simplified to only show Sort view since BST logic was removed) */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <button 
          onClick={() => setCurrentView('sort')} 
          style={{ 
            padding: '10px 20px', 
            fontWeight: 'bold',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'default',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
          }}>
          Array Visualizer (Sorting) 📈
        </button>
      </div>

      {currentView === 'sort' && (
        <>
            {/* CONTROL PANEL */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '20px', 
                marginBottom: '20px', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}>
                {/* Algorithm Selector */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Algorithm:</label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                        disabled={steps && !isSortingComplete}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '180px' }}
                    >
                        {algorithmOptions.map(option => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Array Generation */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Array Size ({arraySize}):</label>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={arraySize}
                        onChange={(e) => setArraySize(parseInt(e.target.value))}
                        disabled={steps && !isSortingComplete}
                        style={{ width: '150px', marginRight: '10px' }}
                    />
                    <button 
                        onClick={() => handleGenerateNewArray()}
                        disabled={steps && !isSortingComplete} // <-- FIXED TRUNCATION HERE: closing the 'disabled' prop
                        style={{ padding: '8px 15px', backgroundColor: '#FFC107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        New Random Array
                    </button>
                </div>
                
                {/* Custom Array Input */}
                <div className="control-group" style={{ flexBasis: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Custom Array (Comma-separated, max {MAX_ARRAY_VALUE}):</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="e.g., 20, 100, 5, 150, 40"
                            value={customInputData}
                            onChange={(e) => setCustomInputData(e.target.value)}
                            disabled={steps && !isSortingComplete}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flexGrow: 1 }}
                        />
                        <button 
                            onClick={handleLoadCustomArray}
                            disabled={steps && !isSortingComplete}
                            style={{ padding: '8px 15px', backgroundColor: '#17A2B8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Load Array
                        </button>
                    </div>
                </div>

                {/* Speed Controls */}
                <div className="control-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Animation Speed ({speed} ms):</label>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        style={{ width: '150px' }}
                    />
                </div>
                
                {/* Play/Pause Controls */}
                <div className="control-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={() => setIsPaused(p => !p)}
                        disabled={!steps || isSortingComplete}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: (steps && !isSortingComplete) ? (isPaused ? '#28A745' : '#DC3545') : '#ccc', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                        }}
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button 
                        onClick={resetVisualizer}
                        disabled={!steps || isSortingComplete}
                        style={{ padding: '10px 20px', backgroundColor: '#6C757D', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Reset/Re-Sort
                    </button>
                    <button 
                        onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                        disabled={!steps || isSortingComplete || !isPaused}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Next Step
                    </button>
                </div>
            </div>

            {/* ERROR / STATUS MESSAGE */}
            {loadingError && (
                <div style={{ padding: '15px', backgroundColor: '#F8D7DA', color: '#721C24', border: '1px solid #F5C6CB', borderRadius: '8px', marginBottom: '20px' }}>
                    **Error:** {loadingError}
                </div>
            )}
            
            {/* CURRENT STEP / ACTION */}
            <div style={{ marginBottom: '15px', fontSize: '1.1em', fontWeight: '600', color: '#333' }}>
                {isSortingComplete 
                    ? <span style={{ color: '#4CAF50' }}>✅ Sort Complete!</span>
                    : (currentStep 
                        ? `Step ${currentStepIndex + 1} / ${steps.length}: ${currentStep.action}` 
                        : 'Generate or Load an Array to begin sorting.'
                    )
                }
            </div>


            {/* VISUALIZER AREA */}
            <div 
                ref={visualizerRef} 
                style={{ 
                    height: `${MAX_DISPLAY_HEIGHT_PX + 50}px`, // Adjusted height to account for value labels
                    border: '1px solid #ccc', 
                    borderRadius: '8px', 
                    backgroundColor: '#fff', 
                    padding: '20px', 
                    marginBottom: '20px',
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    overflowX: 'auto' // Allows scrolling for very large arrays
                }}
            >
                {currentArray.map((value, index) => (
                    <ArrayBar
                        key={index} // Using index as key is safe here because we manage the array immutably via steps
                        value={value}
                        height={MAX_DISPLAY_HEIGHT_PX} // Max height constant passed to Bar component
                        width={visualizerWidth}
                        maxPossibleValue={MAX_ARRAY_VALUE}
                        // Set highlight flags
                        isHighlighted={highlightIndices.includes(index)}
                        isPivot={pivotIndex === index}
                        isSorted={sortedIndices.includes(index)}
                    />
                ))}
            </div>
            
            {/* PSEUDOCODE / INFORMATION PANEL */}
            <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginTop: '20px'
            }}>
                <h3 style={{ fontSize: '1.4em', marginBottom: '10px', color: '#333' }}>
                    Pseudocode: {selectedAlgorithm.toUpperCase()}
                </h3>
                <pre style={{ 
                    backgroundColor: '#f1f8ff', 
                    padding: '15px', 
                    borderRadius: '5px', 
                    fontSize: '0.9em',
                    overflowX: 'auto',
                    borderLeft: '4px solid #007bff'
                }}>
                    {currentPseudocode.join('\n')}
                </pre>
            </div>
        </>
      )}
    </div>
  );
}

export default App;