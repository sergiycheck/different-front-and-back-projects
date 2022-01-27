export interface ApiResponse {
  page: number;
  results: unknown[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: string;
  title: string;
  release_date: string;
  overview: string;
  popularity: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  favorite: boolean;
}
