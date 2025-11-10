# Node class for internal use
class Node:
    def __init__(self, value, left=None, right=None):
        # Ensure value is treated as an integer internally
        self.value = int(value) 
        self.left = left
        self.right = right

    # Helper function to convert Node structure to a serializable dictionary
    def to_dict(self):
        # Recursively convert the tree structure to a dictionary
        return {
            'value': self.value,
            # If a child is None, it serializes to JSON's null.
            'left': self.left.to_dict() if self.left else None,
            'right': self.right.to_dict() if self.right else None,
        }

# Helper function to convert a dictionary back into a Node structure
def from_dict(data):
    # CRITICAL: Handles the initial state where data is None/null
    if data is None: 
        return None
    if not isinstance(data, dict) or 'value' not in data:
        # Fallback for unexpected data structure, treat as empty
        return None 
        
    node = Node(int(data['value'])) 
    node.left = from_dict(data.get('left'))
    node.right = from_dict(data.get('right'))
    return node

# Finds the in-order successor (smallest in the right subtree)
def find_min(node):
    current = node
    while current.left is not None:
        current = current.left
    return current

def get_bst_steps(tree_state, operation, value):
    """
    Processes a BST operation and returns visualization steps and the new tree state.
    """
    
    # 1. Deserialize the tree state
    root = from_dict(tree_state)
    steps = []

    if operation == 'insert':
        # Insert logic
        def insert_recursive(node, value):
            if node is None:
                steps.append({'value': value, 'action': 'Inserted', 'path': []})
                return Node(value)

            steps.append({'value': node.value, 'action': 'Visiting', 'path': []})
            
            if value < node.value:
                steps.append({'value': node.value, 'action': 'Move Left', 'path': []})
                node.left = insert_recursive(node.left, value)
            elif value > node.value:
                steps.append({'value': node.value, 'action': 'Move Right', 'path': []})
                node.right = insert_recursive(node.right, value)
            else:
                steps.append({'value': node.value, 'action': 'Value Already Exists (Skipping)', 'path': []})
            
            return node

        # Handle root insertion (when tree is empty)
        if root is None:
            root = Node(value)
            steps.append({'value': value, 'action': 'Root Inserted', 'path': []})
        else:
            root = insert_recursive(root, value)
            
    elif operation == 'delete':
        # Delete logic (omitted for brevity, assume correctness)
        def delete_recursive(node, value):
            if node is None:
                steps.append({'value': value, 'action': 'Value Not Found', 'path': []})
                return None
            
            steps.append({'value': node.value, 'action': 'Visiting', 'path': []})

            if value < node.value:
                node.left = delete_recursive(node.left, value)
            elif value > node.value:
                node.right = delete_recursive(node.right, value)
            else:
                steps.append({'value': node.value, 'action': 'Target Found', 'path': []})
                if node.left is None: return node.right
                if node.right is None: return node.left

                temp = find_min(node.right)
                node.value = temp.value
                node.right = delete_recursive(node.right, temp.value)

            return node
            
        root = delete_recursive(root, value)
    
    # 2. Return the steps and the new serialized dictionary state (or None)
    # This ensures a dictionary is returned if root exists, and None otherwise.
    new_tree_state_dict = root.to_dict() if root else None
    
    # Optional: Log to your Python console to confirm the output structure
    print(f"[BST DEBUG] New tree state being returned: {new_tree_state_dict}")
    
    return steps, new_tree_state_dict