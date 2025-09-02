import { useState } from "react";

export default function RatingStars({ value = 0, max = 5, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex cursor-pointer">
      {Array.from({ length: max }).map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            type="button"
            onClick={() => onChange?.(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            aria-label={`Calificar con ${ratingValue} estrella${ratingValue > 1 ? 's' : ''}`}
            className={`text-2xl transition-colors ${
              ratingValue <= (hover || value) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
        </button>
        );
      })}
    </div>
  );
}
