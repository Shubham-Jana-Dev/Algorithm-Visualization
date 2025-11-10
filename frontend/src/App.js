import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Components ---

/**
 * ArrayBar Component: Displays a single element in the array visualization.
 * It handles color coding based on the algorithm state.
 */
const ArrayBar = React.memo(({ value, height, width, isHighlighted, isPivot, isSorted, isSearchMid, isSearchRange, isFound, isLinearCheck, isBinarySearchMode, isLinearSearchMode }) => {
    
    // Default color is Blue - using inline styles instead of Tailwind
    let backgroundColor = '#3b82f6'; // blue-500
    let opacity = 1;

    // --- Search Mode Logic ---
    if (isFound) {
        // Found element (Both Search Algorithms) takes highest priority
        backgroundColor = '#10b981'; // emerald-500
    } else if (isLinearCheck) {
        // Linear Search Specific Color for current comparison
        backgroundColor = '#ef4444'; // red-500
    } else if (isSearchMid) {
        // Mid element (Binary Search)
        backgroundColor = '#f59e0b'; // amber-500
    } else if (isSearchRange) {
        // Elements in the current search range (Binary Search)
        backgroundColor = '#60a5fa'; // blue-400
    } else if (isBinarySearchMode) { 
        // Excluded elements during Binary Search
        opacity = 0.3;
        backgroundColor = '#9ca3af'; // gray-400
    }
    
    // --- Sorting Mode Logic (Applied if not in active search highlight) ---
    // Corrected the check here by ensuring isLinearSearchMode is available as a prop
    if (!isBinarySearchMode && !isLinearSearchMode) { // Ensure sorting colors only apply if not in a search mode
        if (isSorted) {
            backgroundColor = '#22c55e'; // green-500
            opacity = 1;
        } else if (isPivot) {
            backgroundColor = '#9333ea'; // purple-600
        } else if (isHighlighted) {
            backgroundColor = '#f97316'; // orange-500
        }
    }

    const finalWidth = width > 0 ? `${width}px` : '20px';

    return (
        <div 
            style={{
                height: `${height}px`,
                width: finalWidth,
                minWidth: finalWidth,
                minHeight: '20px',
                margin: '0 1px',
                backgroundColor: backgroundColor,
                opacity: opacity,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: width > 20 ? '10px' : '8px',
                borderRadius: '4px 4px 0 0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                position: 'relative',
                flexShrink: 0,
                // Maintained transition for smoother visual steps
                transition: 'height 0.2s ease-out, background-color 0.1s linear', 
            }}
            title={`Value: ${value}`}
        >
            {/* Show value for bars wide enough */}
            {width > 20 && value}
        </div>
    );
});

// --- Constants ---
const DEFAULT_ARRAY_SIZE = 15;
const MAX_ARRAY_VALUE = 400; 
const MIN_ARRAY_VALUE = 10;
const ANIMATION_SPEED_MS = 100; 

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
    ],
    selectionsort: [
        "function selectionSort(array):",
        "  n = array.length",
        "  for i from 0 to n - 2:",
        "    // Assume current position i holds the minimum",
        "    minIndex = i",
        "    for j from i + 1 to n - 1:",
        "      // Highlight comparison between array[j] and array[minIndex]",
        "      if array[j] < array[minIndex]:",
        "        // Update the index of the minimum element",
        "        minIndex = j",
        "    // If a smaller element was found, swap it into position i",
        "    if minIndex is not i:",
        "      swap(array[i], array[minIndex])",
        "    // Position i is finalized",
        "  return array"
    ],
    binarysearch: [
        "function binarySearch(array, target):",
        "  // Array MUST be sorted",
        "  low = 0",
        "  high = array.length - 1",
        "  while low <= high:",
        "    mid = floor((low + high) / 2)",
        "    // Highlight mid element (array[mid])",
        "    if array[mid] == target:",
        "      return mid",
        "    else if array[mid] < target:",
        "      // Search right (New Low = mid + 1)",
        "      low = mid + 1",
        "      // Exclude left half",
        "    else:",
        "      // Search left (New High = mid - 1)",
        "      high = mid - 1",
        "      // Exclude right half",
        "  return -1"
    ],
    linearsearch: [
        "function linearSearch(array, target):",
        "  n = array.length",
        "  for i from 0 to n - 1:",
        "    // Highlight array[i]",
        "    if array[i] == target:",
        "      return i",
        "  return -1"
    ],
    bstinsert: [
        "function insert(node, value):",
        "  if node is null:",
        "    return new Node(value)",
        "  if value < node.value:",
        "    node.left = insert(node.left, value)",
        "  else if value > node.value:",
        "    node.right = insert(node.right, value)",
        "  return node"
    ],
    bstsearch: [
        "function search(node, value):",
        "  if node is null or node.value == value:",
        "    return node",
        "  if value < node.value:",
        "    return search(node.left, value)",
        "  else:",
        "    return search(node.right, value)"
    ],
};

// --- Helper Functions (No changes needed to core logic, keeping them concise) ---

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

// --- CLIENT-SIDE ALGORITHM LOGIC (Generators for visualization steps) ---

const getBubbleSortSteps = (initialArray) => { 
    let array = [...initialArray];
    const steps = [];
    const n = array.length;
    let sortedIndices = [];

    const recordStep = (action, highlight_indices = [], newArray = null, sorted_indices = []) => {
        steps.push({
            array: newArray ? [...newArray] : [...array],
            highlight_indices: highlight_indices,
            action: action,
            sorted_indices: [...sorted_indices]
        });
        if (newArray) array = newArray;
    };

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            
            recordStep(`Comparing array[${j}] and array[${j + 1}]`, [j, j + 1], null, sortedIndices);

            if (array[j] > array[j + 1]) {
                const tempArray = [...array];
                [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
                swapped = true;
                
                recordStep(`Swapping ${array[j]} and ${array[j+1]}`, [j, j + 1], tempArray, sortedIndices);
            }
            
            recordStep(`Comparison done. Resetting comparison highlights.`, [], null, sortedIndices);
        }
        
        const sortedIndex = n - 1 - i;
        sortedIndices.push(sortedIndex);
        recordStep(`Position ${sortedIndex} is finalized (Sorted).`, [sortedIndex], null, sortedIndices);


        if (!swapped) {
            for (let k = 0; k < n - 1 - i; k++) {
                if (!sortedIndices.includes(k)) {
                     sortedIndices.push(k);
                }
            }
            break;
        }
    }
    
    if (n > 0 && !sortedIndices.includes(0)) {
        sortedIndices.push(0);
        recordStep(`Final element at index 0 is sorted.`, [0], null, sortedIndices);
    }


    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    recordStep("Finished Bubble Sort", [], null, finalSortedIndices);

    return steps;
};


const getMergeSortSteps = (initialArray) => { 
    let array = [...initialArray];
    const steps = [];
    
    const recordStep = (action, highlight_indices = [], newArray = null, sorted_indices = []) => {
        steps.push({
            array: newArray ? [...newArray] : [...array],
            highlight_indices: highlight_indices,
            action: action,
            sorted_indices: [...sorted_indices]
        });
        if (newArray) array = newArray;
    };

    const merge = (arr, start, mid, end) => {
        const left = arr.slice(start, mid);
        const right = arr.slice(mid, end);
        let i = 0, j = 0, k = start;
        
        recordStep(`Preparing to merge elements from index ${start} to ${end - 1}`, Array.from({ length: end - start }, (_, idx) => start + idx));

        let currentWorkingArray = [...array];

        while (i < left.length && j < right.length) {
            
            recordStep(`Comparing ${left[i]} and ${right[j]}`, [start + i, mid + j]);
            
            if (left[i] <= right[j]) {
                currentWorkingArray[k] = left[i];
                i++;
            } else {
                currentWorkingArray[k] = right[j];
                j++;
            }
            
            recordStep(`Placing element ${currentWorkingArray[k]} at index ${k}`, [k], currentWorkingArray);
            k++;
        }

        while (i < left.length) {
            currentWorkingArray[k] = left[i];
            recordStep(`Placing remaining element ${currentWorkingArray[k]} from left half at ${k}`, [k], currentWorkingArray);
            i++; k++;
        }
        while (j < right.length) {
            currentWorkingArray[k] = right[j];
            recordStep(`Placing remaining element ${currentWorkingArray[k]} from right half at ${k}`, [k], currentWorkingArray);
            j++; k++;
        }
        
        recordStep(`Merged segment complete from index ${start} to ${end - 1}`, Array.from({ length: end - start }, (_, idx) => start + idx));
    };

    const mergeSortHelper = (arr, start, end) => {
        if (end - start <= 1) return;
        
        recordStep(`Splitting array segment from ${start} to ${end - 1}`, Array.from({ length: end - start }, (_, idx) => start + idx));

        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(arr, start, mid);
        mergeSortHelper(arr, mid, end);
        merge(arr, start, mid, end);
    };

    mergeSortHelper(array, 0, array.length);

    const finalSortedIndices = Array.from({ length: array.length }, (_, i) => i);
    recordStep("Finished Merge Sort", [], null, finalSortedIndices);
    
    return steps;
};

const getQuickSortSteps = (initialArray) => { 
    let array = [...initialArray];
    const steps = [];

    const recordStep = (action, highlight_indices = [], pivot_index = null, newArray = null, sorted_indices = []) => {
        steps.push({
            array: newArray ? [...newArray] : [...array],
            action: action,
            highlight_indices: highlight_indices,
            pivot_index: pivot_index,
            sorted_indices: [...sorted_indices]
        });
        if (newArray) array = newArray;
    };

    const sortedIndicesTracker = [];

    const partition = (arr, low, high) => {
        let tempArray = [...arr];
        const pivot = tempArray[high]; 
        let i = low - 1; 

        recordStep(`Selecting pivot ${pivot} at index ${high}`, [], high, null, sortedIndicesTracker);

        for (let j = low; j <= high - 1; j++) {
            
            recordStep(`Comparing ${tempArray[j]} at ${j} with pivot ${pivot}`, [j], high, null, sortedIndicesTracker);
            
            if (tempArray[j] < pivot) {
                i++;
                [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
                
                recordStep(`Swapping ${tempArray[j]} and ${tempArray[i]} to move small element left`, [i, j], high, tempArray, sortedIndicesTracker);
            }
            
            recordStep(`Resetting comparison highlights`, [], high, null, sortedIndicesTracker);
        }

        const pivotIndex = i + 1;
        [tempArray[pivotIndex], tempArray[high]] = [tempArray[high], tempArray[pivotIndex]];
        
        recordStep(`Pivot ${pivot} placed correctly at index ${pivotIndex}`, [pivotIndex], null, tempArray, [...sortedIndicesTracker, pivotIndex]);

        return pivotIndex;
    };

    const quickSortHelper = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high);

            if (!sortedIndicesTracker.includes(pi)) {
                sortedIndicesTracker.push(pi);
            }

            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        } else if (low === high && low >= 0) {
            if (!sortedIndicesTracker.includes(low)) {
                sortedIndicesTracker.push(low);
                recordStep(`Sub-array of size 1 at index ${low} is sorted.`, [], null, null, sortedIndicesTracker);
            }
        }
    };

    quickSortHelper(array, 0, array.length - 1);

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

const getShellSortSteps = (initialArray) => { 
    let array = [...initialArray];
    const steps = [];
    const n = array.length;
    let gap = Math.floor(n / 2);
    let sortedIndices = [];

    const recordStep = (action, highlight_indices = [], current_gap = gap, newArray = null, sorted_indices = []) => {
        steps.push({
            array: newArray ? [...newArray] : [...array],
            action: action,
            highlight_indices: highlight_indices,
            gap: current_gap,
            sorted_indices: [...sorted_indices]
        });
        if (newArray) array = newArray;
    };

    while (gap > 0) {
        recordStep(`Starting pass with Gap = ${gap}`, [], gap, null, sortedIndices);

        for (let i = gap; i < n; i++) {
            let tempArray = [...array];
            const temp = tempArray[i];
            let j = i;

            recordStep(`Selecting element ${temp} at index ${i}. Gap = ${gap}`, [i], gap, null, sortedIndices);

            while (j >= gap && tempArray[j - gap] > temp) {
                
                recordStep(`Comparing ${tempArray[j - gap]} at ${j - gap} and selected element ${temp}. Gap = ${gap}`, [j, j - gap], gap, null, sortedIndices);
                
                tempArray[j] = tempArray[j - gap];
                
                recordStep(`Shifting ${tempArray[j - gap]} to ${j}. Gap = ${gap}`, [j], gap, tempArray, sortedIndices);
                
                j -= gap;
                
                recordStep(`Resetting highlights. Gap = ${gap}`, [], gap, null, sortedIndices);
            }
            
            tempArray[j] = temp;
            
            recordStep(`Placing ${temp} at index ${j}. Gap = ${gap}`, [j], gap, tempArray, sortedIndices);
        }

        gap = Math.floor(gap / 2);
    }
    
    const finalSortedIndices = Array.from({ length: n }, (_, i) => i);
    recordStep("Finished Shell Sort", [], 0, null, finalSortedIndices);

    return steps;
};

const getSelectionSortSteps = (initialArray) => { 
    let array = [...initialArray];
    const steps = [];
    const n = array.length;
    let sortedIndices = [];

    const recordStep = (action, highlight_indices = [], min_index = null, newArray = null, sorted_indices = []) => {
        steps.push({
            array: newArray ? [...newArray] : [...array],
            action: action,
            highlight_indices: highlight_indices,
            pivot_index: min_index, // Using pivot_index to track current minimum
            sorted_indices: [...sorted_indices]
        });
        if (newArray) array = newArray;
    };

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        let tempArray = [...array];
        
        recordStep(`Starting pass ${i + 1}. Current index is ${i}.`, [i], minIndex, null, sortedIndices);

        for (let j = i + 1; j < n; j++) {
            
            recordStep(`Comparing ${tempArray[j]} at ${j} with current minimum ${tempArray[minIndex]} at ${minIndex}.`, [j], minIndex, null, sortedIndices);

            if (tempArray[j] < tempArray[minIndex]) {
                minIndex = j;
                recordStep(`New minimum found: ${tempArray[minIndex]} at index ${minIndex}.`, [j], minIndex, null, sortedIndices);
            }
            
            recordStep(`Comparison done.`, [], minIndex, null, sortedIndices);
        }

        if (minIndex !== i) {
            [tempArray[i], tempArray[minIndex]] = [tempArray[minIndex], tempArray[i]];
            recordStep(`Swapping ${tempArray[minIndex]} (current position) with ${tempArray[i]} (new smallest) to place smallest element at ${i}.`, [i, minIndex], null, tempArray, sortedIndices);
        } else {
             recordStep(`Element at ${i} is already the smallest in the unsorted portion.`, [i], null, null, sortedIndices);
        }
        
        sortedIndices.push(i);
        recordStep(`Position ${i} is finalized (Sorted).`, [], null, null, sortedIndices);
    }
    
    if (n > 0 && !sortedIndices.includes(n - 1)) {
        sortedIndices.push(n - 1);
        recordStep(`Final element at index ${n-1} is sorted.`, [], null, null, sortedIndices);
    }

    const finalSortedIndices = Array.from({ length: n }, (_, k) => k);
    recordStep("Finished Selection Sort", [], null, null, finalSortedIndices);

    return steps;
};


const getBinarySearchSteps = (arr, target) => { 
    const steps = [];
    const array = [...arr];

    steps.push({
        array: [...array],
        action: `Search started for target ${target}. Array must be sorted.`,
        low: 0,
        high: array.length - 1,
        mid: -1,
        found: false,
        search_target: target,
        highlight_indices: [],
        isSearch: true,
    });

    let low = 0;
    let high = array.length - 1;
    let found = false;
    let mid = -1;

    while (low <= high) {
        mid = Math.floor((low + high) / 2);

        steps.push({
            array: [...array],
            action: `Checking mid element at index ${mid}: Value is ${array[mid]}`,
            low: low,
            high: high,
            mid: mid,
            found: false,
            search_target: target,
            highlight_indices: [mid],
            isSearch: true,
        });

        if (array[mid] === target) {
            found = true;
            break;
        } else if (array[mid] < target) {
            low = mid + 1;
            steps.push({
                array: [...array],
                action: `Target (${target}) is greater than ${array[mid]}. Searching right half (New Low: ${low}).`,
                low: low,
                high: high,
                mid: mid,
                found: false,
                search_target: target,
                highlight_indices: [],
                isSearch: true,
            });
        } else {
            high = mid - 1;
            steps.push({
                array: [...array],
                action: `Target (${target}) is less than ${array[mid]}. Searching left half (New High: ${high}).`,
                low: low,
                high: high,
                mid: mid,
                found: false,
                search_target: target,
                highlight_indices: [],
                isSearch: true,
            });
        }
    }

    if (found) {
        steps.push({
            array: [...array],
            action: `SUCCESS! Target ${target} found at index ${mid}. Search complete.`,
            low: low,
            high: high,
            mid: mid,
            found: true,
            search_target: target,
            highlight_indices: [mid],
            isSearch: true,
        });
    } else {
        steps.push({
            array: [...array],
            action: `FAILURE! Target ${target} not found. Low (${low}) > High (${high}).`,
            low: low,
            high: high,
            mid: -1,
            found: false,
            search_target: target,
            highlight_indices: [],
            isSearch: true,
        });
    }

    return steps;
};

const getLinearSearchSteps = (arr, target) => { 
    const steps = [];
    const array = [...arr];
    const n = array.length;
    let found = false;
    let foundIndex = -1;

    steps.push({
        array: [...array],
        action: `Linear Search started for target ${target}.`,
        current_index: -1,
        found: false,
        search_target: target,
        highlight_indices: [],
        isLinearSearch: true,
    });

    for (let i = 0; i < n; i++) {
        
        steps.push({
            array: [...array],
            action: `Comparing element at index ${i}: Value is ${array[i]}`,
            current_index: i,
            found: false,
            search_target: target,
            highlight_indices: [i],
            isLinearSearch: true,
        });
        
        if (array[i] === target) {
            found = true;
            foundIndex = i;
            break;
        }

        steps.push({
            array: [...array],
            action: `Value ${array[i]} does not match ${target}. Moving to next index.`,
            current_index: i,
            found: false,
            search_target: target,
            highlight_indices: [], 
            isLinearSearch: true,
        });
    }

    if (found) {
        steps.push({
            array: [...array],
            action: `SUCCESS! Target ${target} found at index ${foundIndex}. Search complete.`,
            current_index: foundIndex,
            found: true,
            search_target: target,
            highlight_indices: [foundIndex],
            isLinearSearch: true,
        });
    } else {
        steps.push({
            array: [...array],
            action: `FAILURE! Target ${target} not found after checking all elements. Search complete.`,
            current_index: n - 1,
            found: false,
            search_target: target,
            highlight_indices: [],
            isLinearSearch: true,
        });
    }

    return steps;
};


// --- BST Placeholder Component ---

/**
 * BSTVisualizer Component (Placeholder for complex BST logic)
 * This component handles all BST operations and rendering.
 */
const BSTVisualizer = ({ speed, isAnimating, handleStartStopAnimation, selectedAlgorithm }) => {
    // NOTE: In a real app, this component would contain all the state,
    // tree structure, insertion/search logic, and SVG rendering.
    
    // For this example, we'll just show the controls and a placeholder view.
    const [bstElements, setBstElements] = useState([15, 6, 23, 4, 7, 71]);
    const [inputValue, setInputValue] = useState(10);
    const [bstSteps, setBstSteps] = useState(null);
    const [bstStepIndex, setBstStepIndex] = useState(0);

    const isBstAnimationComplete = bstSteps && bstStepIndex >= bstSteps.length - 1 && bstSteps.length > 0; 
    
    // Placeholder logic for BST operation (Insert/Search)
    const handleOperation = (operation) => {
        // In a full implementation, this would trigger the actual BST operation
        // and generate steps for the animation.
        console.log(`Executing BST ${operation} with value: ${inputValue}`);
        
        // --- Placeholder Step Generation ---
        const newSteps = [{
            action: `Simulating ${operation} for value ${inputValue}...`,
            code_line: 1
        }, {
            action: `${operation} complete!`,
            code_line: 7
        }];
        setBstSteps(newSteps);
        setBstStepIndex(0);
        handleStartStopAnimation();
    };

    const currentBstStep = bstSteps ? bstSteps[bstStepIndex] : null;

    useEffect(() => {
        if (!isAnimating || !bstSteps || bstSteps.length === 0 || bstStepIndex >= bstSteps.length - 1) {
            return;
        }

        const timer = setTimeout(() => {
            setBstStepIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
    }, [isAnimating, bstSteps, bstStepIndex, speed]);

    const currentPseudocode = PSEUDOCODE[selectedAlgorithm];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">BST Operations</h3>
                
                {/* Current Elements */}
                <p className="text-sm font-medium text-gray-500">
                    Current Elements: <span className="text-indigo-600 font-mono">{bstElements.join(', ')}</span>
                </p>

                {/* Input and Buttons */}
                <div className="flex flex-col space-y-2">
                    <input
                        type="number"
                        placeholder="Value to Insert/Search"
                        value={inputValue}
                        onChange={(e) => setInputValue(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-lg"
                        disabled={isAnimating}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleOperation('insert')}
                            className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition disabled:opacity-50"
                            disabled={isAnimating || !inputValue}
                        >
                            Insert
                        </button>
                        <button
                            onClick={() => handleOperation('search')}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50"
                            disabled={isAnimating || !inputValue}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Playback Controls */}
                 <div className="flex justify-center items-center space-x-2 border-t pt-4 mt-4">
                    <button onClick={() => setBstStepIndex(0)} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || bstStepIndex === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m4 14l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => setBstStepIndex(prev => Math.max(0, prev - 1))} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || bstStepIndex === 0}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        onClick={handleStartStopAnimation}
                        className={`p-3 rounded-full shadow-lg transform transition disabled:opacity-50 ${isAnimating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        disabled={!bstSteps || bstSteps.length === 0}
                    >
                        {isAnimating ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                    </button>

                    <button onClick={() => setBstStepIndex(prev => Math.min(bstSteps.length - 1, prev + 1))} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || isBstAnimationComplete}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => setBstStepIndex(bstSteps.length - 1)} className="p-2 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || isBstAnimationComplete}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Status and Pseudocode */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Pseudocode</h3>
                    <pre className="text-sm text-gray-200 bg-gray-800 p-2 rounded max-h-40 overflow-y-auto">
                        {currentPseudocode ? currentPseudocode.map((line, index) => (
                            <div key={index} className={`code-line ${currentBstStep && currentBstStep.code_line === index ? 'active' : ''}`}>
                                {line}
                            </div>
                        )) : 'Select an operation (Insert/Search).'}
                    </pre>
                    <p className="mt-3 text-sm font-medium text-gray-800">
                        Status: {currentBstStep ? currentBstStep.action : "Ready for operation."}
                    </p>
                </div>
            </div>

            {/* BST Visualization Area (Placeholder) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-2xl border border-gray-100 min-h-[450px] flex items-center justify-center">
                 <div className="text-center p-8 border-4 border-dashed border-indigo-200 rounded-xl w-full h-full flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-indigo-500">Binary Search Tree Visualization</h2>
                    <p className="mt-2 text-gray-600">The BST structure would be dynamically drawn here using SVG or Canvas.</p>
                    <p className="mt-4 text-sm text-gray-400">Current elements: [{bstElements.join(', ')}]</p>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  // Global State to switch between views
  const [currentView, setCurrentView] = useState('array'); // 'array' or 'bst'
    
  // Sorting/Searching Visualizer States
  const [steps, setSteps] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubblesort"); 
  const [loadingError, setLoadingError] = useState(null);
  const [inputArray, setInputArray] = useState(() => generateRandomArray(DEFAULT_ARRAY_SIZE));
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [customInputData, setCustomInputData] = useState("");
  const [speed, setSpeed] = useState(ANIMATION_SPEED_MS); 
  
  // State for Search Algorithms
  const [searchTarget, setSearchTarget] = useState(50); 
  
  // Animation State
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  // Derived States (Array View)
  const currentStep = steps ? steps[currentStepIndex] : null;
  const currentArray = currentStep ? currentStep.array : inputArray; 
  const highlightIndices = currentStep ? currentStep.highlight_indices : [];
  const pivotIndex = currentStep ? currentStep.pivot_index : null;
  const sortedIndices = currentStep ? currentStep.sorted_indices || [] : [];
  const isSortingComplete = steps && currentStepIndex >= steps.length - 1 && steps.length > 0; 
  
  const isSearchAlgorithm = selectedAlgorithm === 'binarysearch' || selectedAlgorithm === 'linearsearch';
  
  const barWidth = currentArray.length > 0 ? Math.max(10, (800 / currentArray.length) - 2) : 20; 
  const maxVal = Math.max(...inputArray, 100); 

  // --- Handlers ---
  const handleGenerateNewArray = (size = arraySize) => {
      if (isAnimating) handleStartStopAnimation();
      const newArray = generateRandomArray(size);
      setInputArray(newArray);
      setCustomInputData(""); 
      setArraySize(size);
      
      if (isSearchAlgorithm && newArray.length > 0) {
          setSearchTarget(newArray[Math.floor(Math.random() * newArray.length)]); 
      } else {
          setSearchTarget(50); 
      }
  };
  
  const handleLoadCustomArray = () => {
      if (isAnimating) handleStartStopAnimation();
      const newArray = parseCustomArray(customInputData);
      if (newArray.length > 0 && newArray.length <= 50) {
          setInputArray(newArray);
          setArraySize(newArray.length); 
          setLoadingError(null);
          if (isSearchAlgorithm && newArray.length > 0) {
            setSearchTarget(newArray[Math.floor(Math.random() * newArray.length)]);
          } else {
            setSearchTarget(50);
          }
      } else if (newArray.length > 50) {
           setLoadingError("Maximum array size for custom input is 50 elements.");
      } else {
          setLoadingError("Invalid or empty custom array input. Please use comma-separated integers (e.g., 5,12,3,40).");
      }
  };
  
  const handleSearchClick = () => {
    const currentTarget = Number(searchTarget);
    setSearchTarget(currentTarget);
    if (isAnimating) handleStartStopAnimation();
    setCurrentStepIndex(0);
  };

  
  // --- Animation Control Logic (For Array View) ---
  
  const handleStartStopAnimation = useCallback(() => {
    // Clear any pending timeout when toggling animation state
    if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
    }
    
    setIsAnimating(prev => {
        const newState = !prev;
        if (newState && isSortingComplete && currentView === 'array') {
            setCurrentStepIndex(0); // Reset if starting again after completion
        }
        return newState;
    });
  }, [isSortingComplete, currentView]);


  // Effect to handle the single, controlled step progression (Array View)
  useEffect(() => {
    if (currentView !== 'array' || !isAnimating || !steps || steps.length === 0 || currentStepIndex >= steps.length - 1) {
      if (isAnimating && steps && currentStepIndex >= steps.length - 1) {
         // Stop animation if it reaches the end while running
         setIsAnimating(false);
      }
      return; 
    }

    animationRef.current = setTimeout(() => {
        
        setCurrentStepIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            return nextIndex; 
        });

    }, speed);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
    
  }, [isAnimating, steps, currentStepIndex, speed, currentView]); 

  
  // Effect to recalculate steps whenever the array, algorithm, or target changes (Array View)
  useEffect(() => {
    if (currentView !== 'array') return;
    
    if (isAnimating) {
        handleStartStopAnimation(); 
    }
    
    setCurrentStepIndex(0);
    setLoadingError(null);

    if (!inputArray || inputArray.length === 0) {
        setLoadingError("The array is empty. Please generate or enter an array.");
        setSteps(null);
        return;
    }
    
    let arrayForAlgo = [...inputArray];
    if (selectedAlgorithm === 'binarysearch') {
        const isAlreadySorted = arrayForAlgo.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
        
        if (!isAlreadySorted) {
             arrayForAlgo.sort((a, b) => a - b);
             const arraysEqual = arrayForAlgo.length === inputArray.length && 
                                arrayForAlgo.every((val, i) => val === inputArray[i]);
             if (!arraysEqual) {
                 setInputArray(arrayForAlgo); 
             }
             setLoadingError("Binary Search requires a sorted array. The array has been sorted automatically.");
        }
    } else {
        arrayForAlgo = [...inputArray];
    }


    try {
        let newSteps = [];
        switch (selectedAlgorithm) {
            case 'bubblesort':
                newSteps = getBubbleSortSteps(arrayForAlgo);
                break;
            case 'mergesort':
                newSteps = getMergeSortSteps(arrayForAlgo);
                break;
            case 'quicksort':
                newSteps = getQuickSortSteps(arrayForAlgo);
                break;
            case 'shellsort':
                newSteps = getShellSortSteps(arrayForAlgo);
                break;
            case 'selectionsort':
                newSteps = getSelectionSortSteps(arrayForAlgo);
                break;
            case 'binarysearch':
                newSteps = getBinarySearchSteps(arrayForAlgo, searchTarget);
                break;
            case 'linearsearch':
                newSteps = getLinearSearchSteps(arrayForAlgo, searchTarget);
                break;
            default:
                setLoadingError(`Algorithm "${selectedAlgorithm}" is not supported.`);
                setSteps(null);
                return;
        }
        
        if (newSteps && newSteps.length > 0) {
            setSteps(newSteps);
        } else {
            setSteps(null);
            setLoadingError("No steps generated for this algorithm.");
        }

    } catch (e) {
        console.error("Error generating steps:", e);
        setLoadingError("An error occurred while running the algorithm: " + e.message);
        setSteps(null);
    }
    
  }, [selectedAlgorithm, inputArray, searchTarget, currentView]);
  

  const handleStepControl = (action) => {
      if (isAnimating) handleStartStopAnimation();
      
      switch (action) {
          case 'start':
              setCurrentStepIndex(0);
              break;
          case 'back':
              setCurrentStepIndex(prev => Math.max(0, prev - 1));
              break;
          case 'forward':
              setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
              break;
          case 'end':
              if (steps) setCurrentStepIndex(steps.length - 1);
              break;
          default:
              break;
      }
  };
  
  const handleViewChange = (view) => {
      if (isAnimating) handleStartStopAnimation();
      setCurrentView(view);
      
      if (view === 'bst') {
          // Default to an initial BST algorithm if needed
          setSelectedAlgorithm('bstinsert'); 
      } else {
          // Default back to an array algorithm
          setSelectedAlgorithm('bubblesort');
      }
  };


  // --- Array Visualization Render ---
  const renderArrayVisualizer = () => {
    
    const currentPseudocode = PSEUDOCODE[selectedAlgorithm];

    // Determine the state of each bar
    const isBinarySearchMode = selectedAlgorithm === 'binarysearch';
    const isLinearSearchMode = selectedAlgorithm === 'linearsearch';
    const maxBarHeight = 300; 
    
    const lowIndex = currentStep && currentStep.isSearch ? currentStep.low : -1;
    const highIndex = currentStep && currentStep.isSearch ? currentStep.high : -1;
    const midIndex = currentStep && currentStep.isSearch ? currentStep.mid : -1;
    const isFound = currentStep && currentStep.isSearch ? currentStep.found : false;
    const linearCheckIndex = currentStep && currentStep.isLinearSearch ? currentStep.current_index : -1;

    const bars = currentArray.map((value, index) => {
        let isSearchRange = false;
        let isBinarySearchModeBar = false;

        if (isBinarySearchMode) {
            if (index >= lowIndex && index <= highIndex) {
                isSearchRange = true;
            } else {
                isBinarySearchModeBar = true;
            }
        }
        
        return (
            <ArrayBar
                key={index}
                value={value}
                height={(value / maxVal) * maxBarHeight}
                width={barWidth}
                isHighlighted={highlightIndices.includes(index)}
                isPivot={pivotIndex === index}
                isSorted={sortedIndices.includes(index)}
                isSearchMid={midIndex === index}
                isSearchRange={isSearchRange}
                isFound={isFound && (midIndex === index || linearCheckIndex === index)}
                isLinearCheck={isLinearSearchMode && linearCheckIndex === index}
                isBinarySearchMode={isBinarySearchModeBar}
                isLinearSearchMode={isLinearSearchMode} 
            />
        );
    });

    return (
        <>
            {/* Controls Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Algorithm Selection */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Algorithm</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                        disabled={isAnimating}
                    >
                        <optgroup label="Sorting">
                            <option value="bubblesort">Bubble Sort</option>
                            <option value="selectionsort">Selection Sort</option>
                            <option value="mergesort">Merge Sort</option>
                            <option value="quicksort">Quick Sort</option>
                            <option value="shellsort">Shell Sort</option>
                        </optgroup>
                        <optgroup label="Searching">
                            <option value="binarysearch">Binary Search</option>
                            <option value="linearsearch">Linear Search</option>
                        </optgroup>
                    </select>
                </div>
                
                {/* Array Generation and Custom Input */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleGenerateNewArray()}
                            className="flex-1 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow hover:bg-indigo-600 transition disabled:opacity-50"
                            disabled={isAnimating}
                        >
                            Generate Random Array
                        </button>
                        <button
                            onClick={() => handleGenerateNewArray(25)}
                            className="px-4 py-2 bg-indigo-400 text-white font-semibold rounded-lg shadow hover:bg-indigo-500 transition disabled:opacity-50 text-sm"
                            disabled={isAnimating}
                        >
                            Size 25
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g., 10,25,3,40"
                            value={customInputData}
                            onChange={(e) => setCustomInputData(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            disabled={isAnimating}
                        />
                        <button
                            onClick={handleLoadCustomArray}
                            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition disabled:opacity-50 text-sm"
                            disabled={isAnimating}
                        >
                            Load
                        </button>
                    </div>
                </div>

                {/* Animation and Search Control */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Animation Delay (ms): <span className="font-semibold text-indigo-600">{speed}</span>
                    </label>
                    <input
                        type="range"
                        min="50" 
                        max="500"
                        step="10"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isAnimating}
                    />
                    
                    {isSearchAlgorithm && (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Target Value"
                                value={searchTarget}
                                onChange={(e) => setSearchTarget(Number(e.target.value))}
                                className="w-2/3 p-2 border border-gray-300 rounded-lg"
                                disabled={isAnimating}
                            />
                             <button
                                onClick={handleSearchClick}
                                className="w-1/3 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50"
                                disabled={isAnimating || !steps}
                            >
                                Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Visualization Area */}
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        {selectedAlgorithm.split(/(?=[A-Z])/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} Visualization
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                        Total Steps: {steps ? steps.length : 0} | Current Step: {currentStepIndex + 1}
                    </p>
                </div>
                
                {loadingError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
                        {loadingError}
                    </div>
                )}

                <div className="flex items-end justify-center w-full min-h-[350px] max-h-[400px] overflow-x-auto overflow-y-hidden border-b-2 border-gray-300 pb-2">
                    {bars}
                </div>
                
                <p className="mt-4 text-center text-lg font-medium text-gray-800">
                    {currentStep ? currentStep.action : "Press Play to Start Visualization"}
                </p>
            </div>

            {/* Playback Controls and Pseudocode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Playback Controls */}
                <div className="lg:col-span-2 bg-white p-4 rounded-xl border shadow-md flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Playback Controls</h3>
                    <div className="flex justify-center items-center space-x-2">
                        <button onClick={() => handleStepControl('start')} className="p-3 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || currentStepIndex === 0}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m4 14l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => handleStepControl('back')} className="p-3 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || currentStepIndex === 0}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <button
                            onClick={handleStartStopAnimation}
                            className={`p-4 rounded-full shadow-lg transform transition disabled:opacity-50 ${isAnimating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                            disabled={!steps || steps.length === 0}
                        >
                            {isAnimating ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </button>

                        <button onClick={() => handleStepControl('forward')} className="p-3 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || (steps && currentStepIndex === steps.length - 1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button onClick={() => handleStepControl('end')} className="p-3 text-gray-600 hover:text-indigo-600 rounded-full transition disabled:opacity-50" disabled={isAnimating || (steps && currentStepIndex === steps.length - 1)}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Pseudocode */}
                <div className="lg:col-span-1 bg-gray-900 p-4 rounded-xl shadow-md overflow-x-auto">
                    <h3 className="text-lg font-semibold text-white mb-3">Pseudocode</h3>
                    <pre className="text-sm text-gray-200 bg-gray-800 p-2 rounded max-h-60 overflow-y-auto">
                        {currentPseudocode ? currentPseudocode.map((line, index) => (
                            <div key={index} className={`code-line ${currentStep && currentStep.code_line === index ? 'active' : ''}`}>
                                {line}
                            </div>
                        )) : 'Select an algorithm to view pseudocode.'}
                    </pre>
                </div>
            </div>
        </>
    );
  };
  
  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
            .code-line.active {
                background-color: #fef3c7; /* Amber-100 */
                border-left: 4px solid #f59e0b; /* Amber-500 */
                font-weight: 600;
            }
            .code-line {
                padding: 2px 8px;
                transition: all 0.1s ease-in-out;
                font-family: monospace;
                white-space: pre;
            }
        `}} />
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">
                Algorithm Visualizer
            </h1>

            {/* View Switcher */}
            <div className="flex mb-6 border-b border-gray-200 pb-2 space-x-2">
                <button
                    onClick={() => handleViewChange('array')}
                    className={`px-4 py-2 font-semibold rounded-lg transition ${
                        currentView === 'array' 
                            ? 'bg-indigo-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Array Algorithms (Sort & Search)
                </button>
                <button
                    onClick={() => handleViewChange('bst')}
                    className={`px-4 py-2 font-semibold rounded-lg transition ${
                        currentView === 'bst' 
                            ? 'bg-indigo-500 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Binary Search Tree (BST)
                </button>
            </div>


            {/* Render the selected view */}
            {currentView === 'array' ? renderArrayVisualizer() : (
                <BSTVisualizer 
                    speed={speed} 
                    isAnimating={isAnimating} 
                    handleStartStopAnimation={handleStartStopAnimation} 
                    selectedAlgorithm={selectedAlgorithm}
                />
            )}
        </div>
        
        {/* Developer Credit - With mailto link */}
        <div className="mt-6 text-center text-sm font-mono text-gray-600">
            <p>
                Developed by: 
                <a 
                    href="mailto:devshubhamjana@gmail.com" 
                    className="font-bold text-indigo-700 hover:text-indigo-900 transition ml-1"
                    title="Click to send an email to Shubham Jana"
                >
                    Shubham Jana | devshubhamjana@gmail.com
                </a>
            </p>
        </div>
    </div>
  );
}