def get_selection_sort_steps(array):
    """
    Performs the Selection Sort algorithm and returns a list of steps 
    for visualization.

    Each step is a dictionary containing:
    - 'array': The state of the array after the current action.
    - 'action': A descriptive string of the action taken (e.g., 'comparison', 'swap', 'sorted').
    - 'highlight_indices': A list of indices to highlight for the current action.
    """
    n = len(array)
    steps = []
    
    # Record the initial state
    steps.append({
        'array': list(array),
        'action': 'initial_state',
        'highlight_indices': []
    })

    # The main sorting loop
    for i in range(n):
        # Assume the current position 'i' holds the minimum value
        min_idx = i
        
        # Action: Start the search for the minimum element (Highlight 'i')
        steps.append({
            'array': list(array),
            'action': 'start_min_search',
            'highlight_indices': [i]
        })

        # Find the minimum element in the unsorted portion (from i+1 to n)
        for j in range(i + 1, n):
            
            # Action: Comparison
            steps.append({
                'array': list(array),
                'action': 'comparison',
                # Highlight the current candidate for minimum (min_idx) and the element being compared (j)
                'highlight_indices': [min_idx, j]
            })
            
            if array[j] < array[min_idx]:
                min_idx = j
                
                # Action: New minimum found
                steps.append({
                    'array': list(array),
                    'action': 'new_minimum',
                    # Highlight the newly found minimum index
                    'highlight_indices': [min_idx]
                })

        # If the minimum element is not at the current position 'i', swap them
        if min_idx != i:
            
            # --- FIX: Record the 'swap' action BEFORE modifying the array ---
            # Action: Highlight the indices that are about to be swapped (Pre-swap state)
            steps.append({
                'array': list(array),
                'action': 'swap',
                'highlight_indices': [i, min_idx]
            })
            
            # Perform the swap (Modifies the array in place)
            array[i], array[min_idx] = array[min_idx], array[i]
        
        # Action: Mark the current position 'i' as sorted/finalized
        # The 'list(array)' here captures the result of the swap (or lack thereof)
        steps.append({
            'array': list(array),
            'action': 'sorted_position',
            'highlight_indices': [i]
        })

    # Action: Final state (entire array is sorted)
    steps.append({
        'array': list(array),
        'action': 'complete',
        'highlight_indices': []
    })
    
    return steps