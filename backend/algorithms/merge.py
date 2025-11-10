# backend/algorithms/merge.py

def get_merge_sort_steps(array):
    steps = []
    
    # Start the recursive sort process
    def merge_sort(arr, start_index, end_index):
        if start_index >= end_index:
            return

        mid = (start_index + end_index) // 2
        
        # Recursive Division
        merge_sort(arr, start_index, mid)
        merge_sort(arr, mid + 1, end_index)
        
        # Merge Step
        merge(arr, start_index, mid, end_index)

    # The actual merge function that records steps
    def merge(arr, start_index, mid, end_index):
        auxiliary_array = arr[start_index:end_index + 1]
        
        i = 0  # Pointer for the left half (auxiliary array)
        j = mid - start_index + 1  # Pointer for the right half (auxiliary array)
        k = start_index # Pointer for the main array

        while i <= mid - start_index and j <= end_index - start_index:
            # Record comparison state (Highlighting elements being compared)
            steps.append({
                'array': list(arr),
                'highlight_indices': [start_index + i, start_index + j],
                'action': 'comparing'
            })
            
            if auxiliary_array[i] <= auxiliary_array[j]:
                arr[k] = auxiliary_array[i]
                i += 1
            else:
                arr[k] = auxiliary_array[j]
                j += 1
            k += 1
            
            # Record array state after placing an element
            steps.append({'array': list(arr), 'highlight_indices': [k - 1], 'action': 'placement'})


        while i <= mid - start_index:
            arr[k] = auxiliary_array[i]
            # Record placement state
            steps.append({'array': list(arr), 'highlight_indices': [k], 'action': 'placement'})
            i += 1
            k += 1

        while j <= end_index - start_index:
            arr[k] = auxiliary_array[j]
            # Record placement state
            steps.append({'array': list(arr), 'highlight_indices': [k], 'action': 'placement'})
            j += 1
            k += 1
            
    # Copy the initial array state
    arr_copy = list(array)
    steps.append({'array': list(arr_copy), 'highlight_indices': [], 'action': 'initial'})
    
    # Run the sort
    merge_sort(arr_copy, 0, len(arr_copy) - 1)
    
    steps.append({'array': arr_copy, 'highlight_indices': [], 'action': 'complete'})
    
    return steps