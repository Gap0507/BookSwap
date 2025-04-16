import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Tooltip = ({ children, content, open, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(open || false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Handle controlled state
  useEffect(() => {
    if (open !== undefined) {
      setIsVisible(open);
    }
  }, [open]);
  
  // Calculate position
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // Default position (top)
      let x = rect.left + rect.width / 2;
      let y = rect.top - 10;
      
      if (position === 'bottom') {
        y = rect.bottom + 10;
      } else if (position === 'left') {
        x = rect.left - 10;
        y = rect.top + rect.height / 2;
      } else if (position === 'right') {
        x = rect.right + 10;
        y = rect.top + rect.height / 2;
      }
      
      setCoords({ x, y });
    }
  }, [isVisible, position]);
  
  // Handle mouse events if uncontrolled
  const handleMouseEnter = () => {
    if (open === undefined) {
      setIsVisible(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (open === undefined) {
      setIsVisible(false);
    }
  };
  
  // Clone children with refs and event handlers
  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });
  
  // Position classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'transform -translate-x-1/2 translate-y-2';
      case 'left':
        return 'transform -translate-x-full -translate-y-1/2 mr-2';
      case 'right':
        return 'transform translate-x-2 -translate-y-1/2';
      default: // top
        return 'transform -translate-x-1/2 -translate-y-full mb-2';
    }
  };
  
  return (
    <>
      {trigger}
      
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-50 bg-gray-800 text-white rounded-md shadow-lg ${getPositionClasses()}`}
          style={{ 
            left: `${coords.x}px`, 
            top: `${coords.y}px`,
            maxWidth: '300px'
          }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' :
            position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2' :
            'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
          }`}></div>
        </div>,
        document.body
      )}
    </>
  );
};