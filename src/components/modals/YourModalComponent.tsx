// ...existing imports...

export function YourModalComponent({ isOpen, onClose, children }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect and fade animation */}
          <div 
            className="absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            style={{ 
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            onClick={onClose}
          />
          
          {/* Modal content with fade animation */}
          <div 
            className="bg-slate-900 rounded-lg shadow-lg z-10 w-full max-w-md mx-auto transition-all duration-300 ease-in-out"
            style={{ 
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
