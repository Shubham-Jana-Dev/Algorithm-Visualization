import React from 'react';

// Use React.memo to ensure the node only re-renders when its specific props change.
const BSTNode = React.memo(({ x, y, value, radius, style }) => {
    // Determine colors based on the 'style' prop from the visualizer
    let circleColor = '#60A5FA'; // Default: Blue
    let textColor = '#FFFFFF';
    let ringColor = 'none';

    if (style === 'active') {
        circleColor = '#FBBF24'; // Active/Visiting: Amber
        ringColor = '#EF4444';
    } else if (style === 'success') {
        circleColor = '#34D399'; // Inserted/Success: Green
    }

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Outer ring for highlight/active states */}
            {ringColor !== 'none' && (
                <circle 
                    cx="0" cy="0" 
                    r={radius + 3} 
                    fill="none" 
                    stroke={ringColor} 
                    strokeWidth="3"
                />
            )}
            {/* Node Circle */}
            <circle 
                cx="0" cy="0" 
                r={radius} 
                fill={circleColor} 
                stroke="#1F2937" 
                strokeWidth="2"
                // Add CSS transition for smooth movement
                style={{ transition: 'cx 0.5s ease-out, cy 0.5s ease-out, fill 0.5s' }}
            />
            {/* Node Value Text */}
            <text 
                x="0" 
                y="0" 
                dy=".3em" 
                textAnchor="middle" 
                fill={textColor} 
                fontSize="12" 
                fontWeight="bold"
            >
                {value}
            </text>
        </g>
    );
});

export default BSTNode;