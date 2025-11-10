import copy

def get_insertion_sort_steps(arr):
    """
    Sorts an array using Insertion Sort and records every step for visualization.

    Each step is a dictionary containing:
    - 'array': The list state at that moment.
    - 'highlighted_indices': Indices currently being compared or shifted.
    - 'pivot_index': The index of the key element being inserted.
    - 'status': A description of the current action.
    - 'sorted_until': The index up to which the array is considered sorted.
    """
    steps = []
    n = len(arr)
    # Use a deep copy to ensure the original list is not modified during the process
    array = arr[:]

    # --- Initial State ---
    steps.append({
        "array": array[:],
        "highlighted_indices": [],
        "pivot_index": -1,
        "status": "Initial state: Starting Insertion Sort.",
        "sorted_until": 0
    })

    # The outer loop traverses from the second element (index 1) to the end
    for i in range(1, n):
        key = array[i]
        j = i - 1

        # --- Step: Picking the Key ---
        steps.append({
            "array": array[:],
            "highlighted_indices": [i],
            "pivot_index": i,
            "status": f"Selecting key {key} at index {i}. This element will be inserted into the sorted sub-array.",
            "sorted_until": i
        })

        # The inner loop shifts elements greater than the key to the right
        while j >= 0 and key < array[j]:
            
            # --- Step: Comparison & Shift preparation ---
            steps.append({
                "array": array[:],
                "highlighted_indices": [i, j], # Highlight key (i) and the element it's compared against (j)
                "pivot_index": i,
                "status": f"Comparing key {key} with {array[j]} at index {j}. Since {array[j]} > {key}, shifting {array[j]} right.",
                "sorted_until": i
            })

            # Perform the shift
            array[j + 1] = array[j]
            
            # --- Step: Post-Shift state (showing the gap) ---
            steps.append({
                "array": array[:],
                "highlighted_indices": [j + 1], # Highlight the element that was just shifted
                "pivot_index": i,
                "status": f"Element {array[j + 1]} shifted to index {j+1}.",
                "sorted_until": i
            })
            
            j -= 1

        # Insert the key into its correct position
        array[j + 1] = key
        
        # --- Step: Insertion complete ---
        steps.append({
            "array": array[:],
            "highlighted_indices": [j + 1],
            "pivot_index": -1,
            "status": f"Key {key} inserted into final position {j + 1}. The sub-array up to index {i} is now sorted.",
            "sorted_until": i + 1
        })
        
    # --- Final State ---
    steps.append({
        "array": array[:],
        "highlighted_indices": [],
        "pivot_index": -1,
        "status": "Sorting complete.",
        "sorted_until": n
    })

    return steps

# Keep the original function (though it might not be used by app.py)
def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example Usage (optional, for testing the steps function)
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6]
    steps = get_insertion_sort_steps(data)
    print(f"Total steps generated: {len(steps)}")
    # for i, step in enumerate(steps):
    #     print(f"Step {i}: Array: {step['array']}, Status: {step['status']}")