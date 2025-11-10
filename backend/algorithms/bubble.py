# backend/algorithms/bubble.py

def get_bubble_sort_steps(array):
    """
    Placeholder implementation of Bubble Sort step recording.
    Returns a list of array states.
    """
    
    working_array = list(array)
    steps = []
    n = len(working_array)
    
    # 1. Initial State
    steps.append({'array': list(working_array), 'highlight_indices': [], 'action': 'initial'})

    # Actual Bubble Sort logic
    for i in range(n):
        for j in range(0, n - i - 1):
            
            # State before comparison
            steps.append({'array': list(working_array), 'highlight_indices': [j, j+1], 'action': 'comparing'})
            
            if working_array[j] > working_array[j + 1]:
                # Swap
                working_array[j], working_array[j + 1] = working_array[j + 1], working_array[j]
                
                # State after swap
                steps.append({'array': list(working_array), 'highlight_indices': [j, j+1], 'action': 'swapped'})
    
    # 2. Final state
    steps.append({'array': list(working_array), 'highlight_indices': [], 'action': 'complete'})
    
    return steps