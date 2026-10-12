export type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

export type Review = {
    movie: Movie
    description: string;
    rating: number;
    favorite: boolean;
};
