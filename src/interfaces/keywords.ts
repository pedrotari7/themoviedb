import { MovieListResult, Results } from './generic';

export interface Keyword {
  id?: number;
  name?: string;
}

export type Keywords = Results<Keyword>;

export type KeywordMovies = Results<MovieListResult>;
