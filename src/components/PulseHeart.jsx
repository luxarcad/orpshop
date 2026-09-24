import { useState } from 'react';
import { Heart } from 'lucide-react';
import './PulseHeart.css';

export default function PulseHeart({
  count = 0,
  defaultLiked = false,
  onChange,
  showCount = false,
}) {
  const [liked, setLiked] = useState(defaultLiked);
  const [total, setTotal] = useState(count);

  const handleClick = () => {
    const nextLiked = !liked;
    const nextCount = total + (nextLiked ? 1 : -1);

    setLiked(nextLiked);
    setTotal(nextCount);

    onChange?.(nextLiked, nextCount);
  };

  return (
    <button
      className={`pulse-heart ${liked ? 'liked' : ''}`}
      onClick={handleClick}
      aria-label="Agregar a favoritos"
    >
      <span className="pulse-heart-icon">
        <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
      </span>

      {showCount && <span>{total}</span>}
    </button>
  );
}