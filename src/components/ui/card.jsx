// src/components/ui/card.jsx
export function Card({ children, className }) {
    return <div className={`bg-white shadow rounded-lg p-4 ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children, className }) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>;
  }
  
  export function CardDescription({ children }) {
    return <p className="text-sm text-gray-500">{children}</p>;
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }
  
  export function CardFooter({ children, className }) {
    return <div className={`mt-4 ${className}`}>{children}</div>;
  }
  