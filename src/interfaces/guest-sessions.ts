import { MovieListResult, TVListResult, EpisodeListResult, Results } from './generic';

export type GuestSessionRatedMovies = Results<MovieListResult>;
export type GuestSessionRatedShows = Results<TVListResult>;
export type GuestSessionRatedEpisodes = Results<EpisodeListResult>;
