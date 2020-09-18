import * as dotenv from 'dotenv';

import TheMovieDB from '.';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const api_key = process.env['API_KEY'] as string;

const moviedb = new TheMovieDB(api_key);

const workflow = async () => {
  const conf = await moviedb.configurations.getConfiguration();
  console.log(conf);

  const searchResult = await moviedb.search.getMovies({ query: 'tenet' });
  console.log(searchResult);

  const movie = searchResult.results[0];

  const images = await moviedb.movies.getImages(movie.id, {});
  console.log(images);
};

void workflow();
