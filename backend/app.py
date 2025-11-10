from flask import Flask, request, jsonify
from flask_cors import CORS
import random

# --- Algorithm imports ---
# Assuming these files exist in an 'algorithms' directory
from algorithms.selection import get_selection_sort_steps
from algorithms.bubble import get_bubble_sort_steps
from algorithms.insertion import get_insertion_sort_steps
from algorithms.quick import get_quick_sort_steps
from algorithms.merge import get_merge_sort_steps
from algorithms.binarysearch import get_binary_search_steps
from algorithms.linear import get_linear_search_steps
from algorithms.bst import get_bst_steps

# Initialize Flask App
app = Flask(__name__)
# Enable CORS for frontend connection (crucial when running on different ports/domains)
CORS(app) 

@app.route('/api/visualize', methods=['POST'])
def visualize_algorithm():
    """Handles requests for visualization steps for sorting and searching."""
    data = request.get_json()
    algorithm = data.get('algorithm')
    array = data.get('array')
    target = data.get('target') # for search algorithms

    steps = []
    
    # Validation for array presence
    if not array or not isinstance(array, list):
        return jsonify({"error": "Invalid or missing 'array' in request."}), 400

    try:
        if algorithm == 'Bubble Sort':
            steps = get_bubble_sort_steps(list(array))
        elif algorithm == 'Insertion Sort':
            steps = get_insertion_sort_steps(list(array))
        elif algorithm == 'Selection Sort':
            steps = get_selection_sort_steps(list(array))
        elif algorithm == 'Quick Sort':
            steps = get_quick_sort_steps(list(array))
        elif algorithm == 'Merge Sort':
            steps = get_merge_sort_steps(list(array))
        elif algorithm == 'Binary Search':
            # Binary search requires a sorted array
            sorted_array = sorted(list(array)) 
            # Note: This returns (steps, found)
            steps, found = get_binary_search_steps(sorted_array, target)
        elif algorithm == 'Linear Search':
            # Note: This returns (steps, found)
            steps, found = get_linear_search_steps(list(array), target)
        else:
            return jsonify({"error": f"Unsupported algorithm: {algorithm}"}), 400

    except Exception as e:
        # Generic error handling for algorithm logic failure
        print(f"Algorithm error for {algorithm}: {e}")
        return jsonify({"error": f"Error during algorithm execution: {str(e)}"}), 500

    return jsonify({"steps": steps})

@app.route('/api/array', methods=['GET'])
def generate_array():
    """Generates a random array for visualization."""
    size = request.args.get('size', 15, type=int)
    max_val = request.args.get('max_val', 100, type=int)
    
    if size > 100 or size < 1:
        size = 15
    if max_val < 1:
        max_val = 100

    new_array = [random.randint(1, max_val) for _ in range(size)]
    return jsonify({"array": new_array})

@app.route('/api/bst', methods=['POST'])
def bst_operation():
    """Handles insert/delete operations for the Binary Search Tree."""
    data = request.get_json()
    operation = data.get('operation')
    value = data.get('value')
    
    # FIX: Use 'tree_state' (snake_case) to match React request payload
    tree_state = data.get('tree_state') 
    
    # Validation
    if operation not in ['insert', 'delete']:
        return jsonify({"error": "Operation must be 'insert' or 'delete'"}), 400
    
    if value is None:
        return jsonify({"error": "Missing 'value' in request"}), 400
    
    try:
        # get_bst_steps returns (steps, new_tree_state_dict)
        steps, new_state = get_bst_steps(tree_state, operation, value)
        
        # Log for debugging purposes
        print(f"BST Operation: {operation}, Value: {value}. New State Head Value: {new_state.get('value') if new_state else 'None'}")
        
        return jsonify({
            "steps": steps,
            # FIX: Use 'new_tree_state_dict' (snake_case) to match React expectation
            "new_tree_state_dict": new_state 
        })
    except Exception as e:
        print(f"BST operation error: {e}")
        return jsonify({"error": f"Error during BST operation: {str(e)}"}), 500

if __name__ == '__main__':
    # Running on port 5001 as shown in your console log
    app.run(debug=True, port=5001)