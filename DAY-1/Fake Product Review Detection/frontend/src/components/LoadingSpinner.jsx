/**
 * Loading Spinner Component.
 * Displays a centered loading animation with optional message.
 */

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div
        className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}
        style={{ borderWidth: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px' }}
      ></div>
      {message && (
        <p className="text-dark-400 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
