// Componente Loading Spinner riutilizzabile

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  }

  return (
    <div 
      className={`
        animate-spin rounded-full border-2 border-t-transparent
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="Caricamento in corso"
    >
      <span className="sr-only">Caricamento...</span>
    </div>
  )
}