import copy

def get_quick_sort_steps(arr):
    """
    Quick Sort অ্যালগরিদমের প্রতিটি ধাপ (steps) তৈরি করে।
    প্রতিটি ধাপে array, action, indices, pivot_index ইত্যাদি তথ্য সংরক্ষণ করা হয়।
    """
    steps = []
    
    # প্রাথমিক ধাপ সংরক্ষণ
    steps.append({
        "array": copy.deepcopy(arr), 
        "action": "Initial State", 
        "indices": [],
        "pivot_index": -1,
        "boundary_left": -1,
        "boundary_right": -1
    })

    def swap(array, i, j):
        """দুটি উপাদানের অবস্থান পরিবর্তন করে।"""
        array[i], array[j] = array[j], array[i]

    def partition(array, low, high):
        """
        Partition ফাংশনটি একটি pivot নির্বাচন করে এবং অ্যারেটিকে দুটি অংশে বিভক্ত করে।
        এখানে ডানদিকের শেষ উপাদানটি pivot হিসেবে নেওয়া হয়েছে।
        """
        # pivot-কে ডানদিকে ধরে নেওয়া হলো
        pivot = array[high]
        
        # pivot-এর সঠিক অবস্থানের জন্য ইনডেক্স
        i = low - 1  
        
        # প্রতিটি ধাপ ট্র‍্যাক করা: Pivot নির্বাচন এবং Range নির্ধারণ
        steps.append({
            "array": copy.deepcopy(array), 
            "action": f"Selecting Pivot {pivot} and Partitioning Range", 
            "indices": list(range(low, high + 1)), # সম্পূর্ণ রেঞ্জ হাইলাইট করা হলো
            "pivot_index": high,
            "boundary_left": low,
            "boundary_right": high
        })

        for j in range(low, high):
            # j-কে বর্তমান তুলনার index হিসেবে দেখানো
            steps.append({
                "array": copy.deepcopy(array), 
                "action": f"Comparing {array[j]} with Pivot {pivot}", 
                "indices": [j, high] + ([i + 1] if i >= low - 1 else []), # বর্তমান উপাদান, pivot, এবং পরবর্তী সম্ভাব্য swap অবস্থান
                "pivot_index": high,
                "boundary_left": low,
                "boundary_right": high
            })
            
            # যদি বর্তমান উপাদান pivot-এর চেয়ে ছোট বা সমান হয়
            if array[j] <= pivot:
                i += 1
                
                # i এবং j এর মধ্যে swapping
                if i != j:
                    swap(array, i, j)
                
                    # swapping এর ধাপ ট্র‍্যাক করা
                    steps.append({
                        "array": copy.deepcopy(array), 
                        "action": f"Swapping smaller element {array[i]} (at {j}) with element at {i}", 
                        "indices": [i, j, high], 
                        "pivot_index": high,
                        "boundary_left": low,
                        "boundary_right": high
                    })
                # যদি i == j হয়, তবে array[j] সঠিক অবস্থানেই আছে। তাই কোনো অতিরিক্ত swap step log করার দরকার নেই।


        # pivot-কে তার সঠিক অবস্থানে স্থাপন (i + 1)
        final_pivot_index = i + 1
        swap(array, final_pivot_index, high)
        
        # pivot স্থাপনের শেষ ধাপ ট্র‍্যাক করা
        steps.append({
            "array": copy.deepcopy(array), 
            "action": f"Pivot {pivot} placed at final sorted position ({final_pivot_index})", 
            "indices": [final_pivot_index],
            "pivot_index": final_pivot_index,
            "boundary_left": -1, # Boundary reset
            "boundary_right": -1  # Boundary reset
        })
        
        return final_pivot_index

    def quick_sort_recursive(array, low, high):
        if low < high:
            # pi হল বিভাজন সূচক
            pi = partition(array, low, high)

            # বামদিকের উপাদানগুলিকে সাজানো 
            quick_sort_recursive(array, low, pi - 1)
            
            # ডানদিকের উপাদানগুলিকে সাজানো 
            quick_sort_recursive(array, pi + 1, high)

    # আসল অ্যারে পরিবর্তন না করার জন্য কপি ব্যবহার করা হলো
    temp_arr = copy.deepcopy(arr)
    quick_sort_recursive(temp_arr, 0, len(temp_arr) - 1)
    
    # চূড়ান্ত সাজানোর ধাপ
    steps.append({
        "array": temp_arr, 
        "action": "Sorting Complete", 
        "indices": list(range(len(temp_arr))), # সম্পূর্ণ অ্যারে হাইলাইট
        "pivot_index": -1,
        "boundary_left": -1,
        "boundary_right": -1
    })
    
    return steps

if __name__ == '__main__':
    # দ্রুত পরীক্ষা করার জন্য
    test_array = [10, 7, 8, 9, 1, 5]
    result_steps = get_quick_sort_steps(test_array)
    print(f"Total Steps: {len(result_steps)}")
    # for step in result_steps:
    #     print(step['array'], step['action'])