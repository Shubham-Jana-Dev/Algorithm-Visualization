import copy

def get_binary_search_steps(arr, target):
    """
    Binary Search অ্যালগরিদমের প্রতিটি ধাপ তৈরি করে।
    এটি মনে করে যে ইনপুট অ্যারেটি সাজানো (sorted) আছে।
    """
    steps = []
    
    # প্রাথমিক ধাপ ট্র‍্যাক করা
    steps.append({
        "array": copy.deepcopy(arr), 
        "action": f"Search started for {target}", 
        "indices": [],
        "low": 0,
        "high": len(arr) - 1,
        "mid": -1,
        "found": False
    })

    low = 0
    high = len(arr) - 1
    found = False

    while low <= high:
        mid = (low + high) // 2
        
        # মধ্যম উপাদান (mid element) ট্র‍্যাক করা
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Checking mid element at index {mid}: Value is {arr[mid]}", 
            "indices": [mid],
            "low": low,
            "high": high,
            "mid": mid,
            "found": False
        })
        
        # তুলনা
        if arr[mid] == target:
            found = True
            break
        elif arr[mid] < target:
            # মধ্যম উপাদানের ডান দিকে সার্চ করা হবে
            low = mid + 1
            steps.append({
                "array": copy.deepcopy(arr), 
                "action": f"Target is greater than {arr[mid]}. Setting new low to {low}.", 
                "indices": [],
                "low": low,
                "high": high,
                "mid": mid,
                "found": False
            })
        else:
            # মধ্যম উপাদানের বাম দিকে সার্চ করা হবে
            high = mid - 1
            steps.append({
                "array": copy.deepcopy(arr), 
                "action": f"Target is less than {arr[mid]}. Setting new high to {high}.", 
                "indices": [],
                "low": low,
                "high": high,
                "mid": mid,
                "found": False
            })

    # চূড়ান্ত ফলাফল ট্র‍্যাক করা
    if found:
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Target {target} found at index {mid}", 
            "indices": [mid],
            "low": low,
            "high": high,
            "mid": mid,
            "found": True
        })
    else:
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Target {target} not found in the array.", 
            "indices": [],
            "low": low,
            "high": high,
            "mid": -1,
            "found": False
        })
        
    return steps

if __name__ == '__main__':
    # দ্রুত পরীক্ষা করার জন্য
    test_array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    target_value = 23
    result_steps = get_binary_search_steps(test_array, target_value)
    # print(len(result_steps))
    # for step in result_steps:
    #     print(step)