interface BadgeProps {
  children: string;
  variant?: 'success' | 'pending' | 'error';
}

export function Badge({ children, variant = 'success' }: BadgeProps) {
  const variants = {
    success: 'bg-teal-100 text-teal-800',
    pending: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}