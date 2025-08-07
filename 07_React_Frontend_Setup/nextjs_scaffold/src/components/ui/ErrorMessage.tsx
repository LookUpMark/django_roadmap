// Componente per visualizzare messaggi di errore

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorMessage({ 
  message, 
  title = "Si è verificato un errore",
  onRetry,
  className = "" 
}: ErrorMessageProps) {
  return (
    <div className={`alert-error ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-red-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200"
              >
                🔄 Riprova
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}