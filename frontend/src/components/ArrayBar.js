// frontend/src/components/ArrayBar.js

import React from 'react';
import './ArrayBar.css';

const ArrayBar = ({ value, height, width, isHighlighted }) => { 
    return (
        <div 
            className={`array-bar ${isHighlighted ? 'highlighted' : ''}`} 
            style={{ 
                // Using the calculated height for visual scaling
                height: `${height}px`, 
                width: `${width}px`,
                // REMOVED: transform: `translateY(${-height}px)` 
            }}>
            {/* Display value */}
            <div className="bar-value">{value}</div> 
        </div>
    );
};

export default ArrayBar;