/**
 * Star Rating Component.
 * Interactive star rating input (1-5 stars).
 */
import { HiStar } from 'react-icons/hi2';

const StarRating = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate?.(star)}
          className={`star ${sizes[size]} ${star <= rating ? 'filled' : 'empty'} ${
            readonly ? 'cursor-default' : ''
          }`}
        >
          <HiStar />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
