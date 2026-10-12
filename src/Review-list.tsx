import { Link, useOutletContext } from "react-router";
import { Heart, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Reviews } from "./reviews";
import type { Review } from "./types";

type ContextType = {
  reviews: Reviews;
  removeReview(review: Review): void;
  updateReview(review: Review): void;
};

const IMG_BASE = "https://image.tmdb.org/t/p/w154";


export function StarRating({ rating, onChange }: { rating: number; onChange(rating: number): void }) {
  const stars = rating / 2; 
  const color = "text-blue-500";

   function handleClick(i: number, fill: number) {
    if (fill === 0) onChange(i * 2);          
    else if (fill === 1) onChange(i * 2 - 1);  
    else onChange((i - 1) * 2);               // funkar som letterboxd full till halv till tom till full. 
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(Math.max(stars - (i - 1), 0), 1); 
        return (
          <button
            key={i}
            type = "button"
            className="relative inline-block size-6 cursor-pointer"
            aria-label={`Star ${i}`}
            onClick={() => handleClick(i, fill)}
          >
            <Star className="size-6 text-muted-foreground/40" />
            <span
              className="absolute left-0 top-0 h-full overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className={cn("size-6 max-w-none fill-current", color)} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewList() {
  const { reviews, removeReview, updateReview } = useOutletContext<ContextType>();
  const list = Object.values(reviews.reviews);

  if (list.length === 0) return <p>No reviews yet.</p>;

  return (
    <ul className="grid grid-cols-4 gap-4">
      {list.map(review => {
        const { movie } = review;
        return (
          <li key={movie.id}>
            <Card className="flex flex-row items-start gap-4 p-4">
              <Link to={`/review/${movie.id}`} className="shrink-0">
                {movie.poster_path ? (
                  <img src={IMG_BASE + movie.poster_path} alt={movie.title} className="h-[150px] w-[100px] rounded-md object-cover" />
                ) : (
                  <div className="flex h-[150px] w-[100px] items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">No image</div>
                )}
              </Link>

              <div>
                <Link to={`/review/${movie.id}`}>
                  <h2>{movie.title}</h2>
                </Link>

                <div>
                  <StarRating
                    rating={review.rating}
                    onChange={rating => updateReview({ ...review, rating })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={review.favorite ? "Remove favorite" : "Add favorite"}
                    onClick={() => updateReview({ ...review, favorite: !review.favorite })}
                  >
                    <Heart className={review.favorite ? "fill-red-500 text-red-500" : ""} />
                  </Button>
                </div>

                <Button variant="destructive" onClick={() => removeReview(review)}>
                  <Trash2 /> Remove
                </Button>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export default ReviewList;