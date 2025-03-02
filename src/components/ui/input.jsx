// src/components/ui/input.jsx
export function Input({ className, ...props }) {
    return (
      <input
        {...props}
        className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none ${className}`}
      />
    );
  }
  