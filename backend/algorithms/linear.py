import copy

def get_linear_search_steps(arr, target):
    """
    Linear Search অ্যালগরিদমের প্রতিটি ধাপ তৈরি করে।
    এটি অ্যারের প্রতিটি উপাদানকে ক্রমানুসারে টার্গেটের সাথে তুলনা করে।
    """
    steps = []
    n = len(arr)
    found = False
    
    # প্রাথমিক ধাপ ট্র‍্যাক করা
    steps.append({
        "array": copy.deepcopy(arr), 
        "action": f"Search started for {target}", 
        "indices": [],
        "current_index": -1,
        "found": False
    })

    for i in range(n):
        
        # অ্যাকশন: বর্তমান উপাদান পরীক্ষা করা (comparison)
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Comparing element at index {i}: Value is {arr[i]}", 
            "indices": [i], # হাইলাইট করার জন্য বর্তমান সূচক
            "current_index": i,
            "found": False
        })
        
        # তুলনা
        if arr[i] == target:
            found = True
            break
            
        # অ্যাকশন: তুলনা ব্যর্থ হয়েছে, পরবর্তী ধাপে যাওয়া
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Value {arr[i]} does not match {target}. Moving to next index.", 
            "indices": [], # কোনো বিশেষ হাইলাইট নেই, বা পরের ইনডেক্স হাইলাইট করা যেতে পারে
            "current_index": i,
            "found": False
        })


    # চূড়ান্ত ফলাফল ট্র‍্যাক করা
    if found:
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Target {target} found at index {i}", 
            "indices": [i], # যেখানে পাওয়া গেছে সেই সূচক হাইলাইট করা
            "current_index": i,
            "found": True
        })
    else:
        steps.append({
            "array": copy.deepcopy(arr), 
            "action": f"Target {target} not found after checking all elements.", 
            "indices": [],
            "current_index": n - 1, # শেষ চেক করা সূচক
            "found": False
        })
        
    return steps

if __name__ == '__main__':
    # দ্রুত পরীক্ষা করার জন্য
    test_array = [3, 44, 38, 5, 47, 15, 36, 26]
    target_value = 47
    result_steps = get_linear_search_steps(test_array, target_value)
    print(f"Total steps for Linear Search of {target_value}: {len(result_steps)}")
    # for step in result_steps:
    #     print(step)