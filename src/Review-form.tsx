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

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieSearch({ onSelect }: { onSelect(movie: Movie): void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim() === "") return;

    setLoading(true);
    setError(null);
    try {
      const url =
        "https://api.themoviedb.org/3/search/movie" +
        `?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB svarade med status ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results);
    } catch {
      setError("Sökningen misslyckades.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <label htmlFor="movie-search" className="sr-only">
          Sök film
        </label>
        <input
          id="movie-search"
          type="search"
          placeholder="Sök efter en film..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Söker..." : "Sök"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results && results.length === 0 && (
        <p className="text-sm text-muted-foreground">Inga filmer hittades.</p>
      )}

      {results && results.length > 0 && (
        <ul className="grid gap-2">
          {results.map(movie => (
            <li key={movie.id}>
              <Button type="button" variant="outline" onClick={() => onSelect(movie)}>
                {movie.title}
                {movie.release_date && ` (${movie.release_date.slice(0, 4)})`}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewFormInner({ movieId }: { movieId?: string }) {
  const { reviews, updateReview } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const existing = movieId
    ? Object.values(reviews.reviews).find(r => r.movie.id === Number(movieId))
    : undefined;
  const startMovie = existing?.movie ?? null;

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
        <MovieSearch onSelect={setMovie} />
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
            
              <Button type="button" variant="link" className="h-auto p-0" onClick={() => {
                  setMovie(null);
                  navigate("/review");
                }}>
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