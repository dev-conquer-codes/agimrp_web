// SimpleToast.tsx
import { useEffect, useState } from 'react';

interface SimpleToastProps {
  message: string;
}

export default function SimpleToast({ message }: SimpleToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}
