import { useState, type FormEvent } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./Review-list";
import type { Reviews } from "./reviews";
import type { Movie, Review } from "./types";

type ContextType = {
  reviews: Reviews;
  updateReview(review: Review): void;
};

const IMG_BASE = "https://image.tmdb.org/t/p/w342";

const placeholderMovies: Movie[] = [
  {
    id: 27205,
    title: "Inception",
    overview: "A thief who steals secrets from people's dreams...",
    release_date: "2010-07-15",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    vote_average: 8.4,
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "A team of explorers travels through a wormhole...",
    release_date: "2014-11-05",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.5,
  },
  {
    id: 1,
    title: "Testfilm utan poster",
    overview: "",
    release_date: "2020-01-01",
    poster_path: null,
    vote_average: 0,
  },
];

function MovieSearch({ onSelect }: { onSelect(movie: Movie): void }) {
  return (
    <ul className="grid gap-2">
      {placeholderMovies.map(movie => (
        <li key={movie.id}>
          <Button type="button" variant="outline" onClick={() => onSelect(movie)}>
            {movie.title} ({movie.release_date.slice(0, 4)})
          </Button>
        </li>
      ))}
    </ul>
  );
}

function ReviewFormInner({ movieId }: { movieId?: string }) {
  const { reviews, updateReview } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const existing = movieId
    ? Object.values(reviews.reviews).find(r => r.movie.id === Number(movieId))
    : undefined;
  const startMovie = existing?.movie
    ?? placeholderMovies.find(m => m.id === Number(movieId))
    ?? null;

  const [movie, setMovie] = useState<Movie | null>(startMovie);
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [favorite, setFavorite] = useState(existing?.favorite ?? false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!movie || rating === null) return;
    updateReview({ movie, rating, description: description.trim(), favorite });
    navigate("/list");
  }

  if (!movie) {
    return (
      <Card className="p-4">
        <h2 className="text-xl font-semibold">Vilken film vill du recensera?</h2>
        <MovieSearch onSelect={movie => navigate(`/review/${movie.id}`)} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-row gap-6">
        {movie.poster_path ? (
          <img src={IMG_BASE + movie.poster_path} alt={movie.title} className="w-[200px] shrink-0 rounded-md" />
        ) : (
          <div className="flex h-[300px] w-[200px] shrink-0 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            
              <Button type="button" variant="link" className="h-auto p-0" onClick={() => navigate("/review")}>
                Byt film
              </Button>
            
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={rating ?? 0} onChange={setRating} />
            <span className="text-sm text-muted-foreground">
              {rating === null ? "Välj betyg" : `${(rating / 2).toFixed(1)} / 5.0`}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={favorite ? "Ta bort favorit" : "Markera som favorit"}
              onClick={() => setFavorite(f => !f)}
            >
              <Heart className={favorite ? "fill-red-500 text-red-500" : ""} />
            </Button>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Beskrivning (valfritt)</span>
            <Textarea
              rows={5}
              placeholder="Vad tyckte du?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>

          <Button type="submit" disabled={rating === null} className="self-start">
            Lämna omdöme
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ReviewForm() {
  const { movieId } = useParams();
  return <ReviewFormInner key={movieId ?? "new"} movieId={movieId} />;
}

export default ReviewForm;