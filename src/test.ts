import TheMovieDB from './themoviedb';

const api_key = 'api_key';

const moviedb = new TheMovieDB(api_key);

const workflow = async () => {
  const conf = await moviedb.configurations.getConfiguration();
  console.log(conf);

  const searchResult: any = await moviedb.search.getMovie({ query: 'tenet' });
  console.log(searchResult);

  const movie = searchResult.results[0];

  const images = await moviedb.movies.getImages({ id: movie.id });
  console.log(images);
};

workflow();
