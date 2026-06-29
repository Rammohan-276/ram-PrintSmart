import React, { useState, useRef, useEffect, useCallback } from 'react';

const DraggableMapPin = ({ onDrop, mapContainerRef }) => {
  console.log('📍 DraggableMapPin rendered!', { onDrop: !!onDrop, mapContainerRef: !!mapContainerRef });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const pinRef = useRef(null);

  // Handle mouse down on pin
  const handleMouseDown = (e) => {
    console.log('🐆 MOUSE DOWN on pin!', e);
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    console.log('🐆 Drag started, isDragging set to true');
    
    // Set initial drag position to current mouse position immediately
    setDragPosition({ x: e.clientX, y: e.clientY });
    
    // Change cursor globally
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Immediately attach mouse move listener to current element
    const handleImmediateMove = (moveEvent) => {
      setDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
    };
    
    // Add temporary immediate listener
    document.addEventListener('mousemove', handleImmediateMove);
    
    // Clean up immediate listener after a short delay
    setTimeout(() => {
      document.removeEventListener('mousemove', handleImmediateMove);
    }, 100);
  };

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      console.log('🐇 Mouse moving during drag:', { x: e.clientX, y: e.clientY });
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging]);

  // Handle mouse up (drop)
  const handleMouseUp = useCallback((e) => {
    console.log('🖱️ Mouse up event:', { isDragging, clientX: e.clientX, clientY: e.clientY });
    
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Check if dropped on map
      if (mapContainerRef && mapContainerRef.current) {
        const mapRect = mapContainerRef.current.getBoundingClientRect();
        const dropX = e.clientX;
        const dropY = e.clientY;
        
        console.log('📊 Map bounds:', {
          mapRect: { left: mapRect.left, top: mapRect.top, right: mapRect.right, bottom: mapRect.bottom, width: mapRect.width, height: mapRect.height },
          dropPosition: { x: dropX, y: dropY }
        });
        
        // Check if drop position is within map bounds
        const isInMapBounds = (
          dropX >= mapRect.left &&
          dropX <= mapRect.right &&
          dropY >= mapRect.top &&
          dropY <= mapRect.bottom
        );
        
        console.log('✅ Drop in map bounds:', isInMapBounds);
        
        if (isInMapBounds) {
          // Calculate relative position within map
          const relativeX = (dropX - mapRect.left) / mapRect.width;
          const relativeY = (dropY - mapRect.top) / mapRect.height;
          
          console.log('📍 Calculated relative position:', { x: relativeX, y: relativeY });
          
          // Trigger drop callback with relative coordinates
          if (onDrop) {
            console.log('🎯 Calling onDrop callback...');
            onDrop({ x: relativeX, y: relativeY, screenX: dropX, screenY: dropY });
          } else {
            console.warn('⚠️ onDrop callback not provided!');
          }
        } else {
          console.log('❌ Pin dropped outside map bounds');
        }
      } else {
        console.warn('⚠️ Map container ref not found!');
        console.log('mapContainerRef:', mapContainerRef);
        console.log('mapContainerRef.current:', mapContainerRef?.current);
      }
      
      // Reset drag position
      setDragPosition({ x: 0, y: 0 });
    }
  }, [isDragging, onDrop, mapContainerRef]);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    console.log('📋 useEffect triggered, isDragging:', isDragging);
    
    if (isDragging) {
      console.log('🎯 Adding global mouse event listeners');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        console.log('🎯 Removing global mouse event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const pinStyle = {
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    width: '50px', // Made larger for easier clicking
    height: '50px',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 9999 : 2000, // Higher z-index
    transition: isDragging ? 'none' : 'all 0.2s ease',
    userSelect: 'none',
    animation: isHovered && !isDragging ? 'bounce 1s infinite' : 'none',
    touchAction: 'none',
    pointerEvents: 'auto', // Ensure pointer events work
    border: process.env.NODE_ENV === 'development' ? '2px solid lime' : 'none', // Debug border
    backgroundColor: process.env.NODE_ENV === 'development' ? 'rgba(255,0,0,0.3)' : 'transparent' // Debug background
  };

  const draggingPinStyle = {
    position: 'fixed',
    left: `${dragPosition.x - 20}px`,
    top: `${dragPosition.y - 40}px`, // Adjusted for better pin tip alignment
    width: '40px',
    height: '40px',
    cursor: 'grabbing',
    zIndex: 9999,
    pointerEvents: 'none',
    transform: 'scale(1.3)', // Slightly larger for better visibility
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
    transition: 'none' // Remove any transition delays
  };

  return (
    <>
      {/* Static Pin (always visible on sidebar) */}
      <div
        ref={pinRef}
        style={pinStyle}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => {
          console.log('🐭 Mouse entered pin');
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          console.log('🐭 Mouse left pin');
          setIsHovered(false);
        }}
        title="Drag this pin to explore locations"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 40 40"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
        >
          {/* Pin Shadow */}
          <ellipse
            cx="20"
            cy="36"
            rx="8"
            ry="3"
            fill="rgba(0,0,0,0.2)"
          />
          
          {/* Pin Body */}
          <path
            d="M20 4 C13 4 7 9 7 16 C7 25 20 34 20 34 S33 25 33 16 C33 9 27 4 20 4 Z"
            fill="#EA4335"
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Pin Center Circle */}
          <circle
            cx="20"
            cy="16"
            r="6"
            fill="#fff"
          />
          
          {/* Pin Inner Dot */}
          <circle
            cx="20"
            cy="16"
            r="3"
            fill="#EA4335"
          />
          
          {/* Glint Effect */}
          <path
            d="M16 12 C17 11 19 11 20 12"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Dragging Pin (follows mouse) */}
      {isDragging && (
        <div style={draggingPinStyle}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
          >
            {/* Animated Pin Body */}
            <path
              d="M20 4 C13 4 7 9 7 16 C7 25 20 34 20 34 S33 25 33 16 C33 9 27 4 20 4 Z"
              fill="#34D399"
              stroke="#fff"
              strokeWidth="2"
              style={{
                animation: 'pulse 0.6s ease-in-out infinite alternate'
              }}
            />
            
            {/* Pin Center Circle */}
            <circle
              cx="20"
              cy="16"
              r="6"
              fill="#fff"
            />
            
            {/* Pin Inner Dot */}
            <circle
              cx="20"
              cy="16"
              r="3"
              fill="#10B981"
            />
          </svg>
        </div>
      )}

      {/* Drop Instructions */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#64ffda',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10000,
            border: '1px solid #64ffda',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          📍 Drop the pin on the map to explore that location
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(-50%);
          }
          40% {
            transform: translateY(-60%);
          }
          60% {
            transform: translateY(-55%);
          }
        }

        @keyframes pulse {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default DraggableMapPin;