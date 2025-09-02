import { useState } from "react";
import RatingStars from "./RatingStars";

export default function BookReview({ bookTitle }) {
  // Estado local del rating que el usuario marca
  const [rating, setRating] = useState(0);

  return (
    <section aria-labelledby="rating-title" className=" border-gray-200 mt-8">
      <h2 id="rating-title" className="text-lg font-serif font-semibold ">
        Califica este libro: {bookTitle}
      </h2>

      <RatingStars value={rating} onChange={setRating} />

      <p className=" text-sm text-gray-700">
        {rating > 0 ? `Tu puntuación: ${rating} estrella${rating > 1 ? 's' : ''}` : 'Aún no calificaste'}
      </p>
    </section>
  );
}
