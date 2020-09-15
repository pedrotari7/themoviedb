import { XMLHttpRequest } from 'xmlhttprequest';

export default class TheMovieDB {
  private base_uri = 'http://api.themoviedb.org/3/';
  private images_uri = 'http://image.tmdb.org/t/p/';
  private timeout = 5000;
  private language = 'en-US';

  constructor(private api_key: string) {}

  private generateQuery = (options: any = {}) => {
    let query = `?api_key=${this.api_key}&language=${this.language}`;

    if (Object.keys(options).length > 0) {
      for (let option in options) {
        if (options.hasOwnProperty(option) && option !== 'id' && option !== 'body') {
          query = `${query}&${option}=${options[option]}`;
        }
      }
    }
    return query;
  };

  public getImage = ({ size, file }: { size: string; file: string }) => this.images_uri + size + '/' + file;

  private client = (
    {
      url,
      method = 'GET',
      status = 200,
      body,
      options = {},
    }: { url: string; method?: string; status?: number; body?: any; options?: any },
    success: Function,
    error: Function
  ) => {
    const xhr: any = new XMLHttpRequest();

    xhr.ontimeout = function () {
      error('{"status_code":408,"status_message":"Request timed out"}');
    };

    xhr.open(method, this.base_uri + url + this.generateQuery(options), true);

    if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
    }

    xhr.timeout = this.timeout;

    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === status) {
          success(JSON.parse(xhr.responseText));
        } else {
          error(xhr.responseText);
        }
      } else {
        error(xhr.responseText);
      }
    };

    xhr.onerror = () => {
      error(xhr.responseText);
    };

    if (method === 'POST') {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send(null);
    }
  };

  private GET = (url: string, options = {}) => {
    return new Promise<Object>((res, rej) => {
      this.client({ url, options }, res, rej);
    });
  };

  private POST = (url: string, body: Object, options = {}) => {
    return new Promise((res, rej) => {
      this.client({ url, options, status: 201, method: 'POST', body }, res, rej);
    });
  };

  private DELETE = (url: string, body: Object, options = {}) => {
    return new Promise((res, rej) => {
      this.client({ url, options, status: 204, method: 'DELETE', body }, res, rej);
    });
  };

  public configurations = {
    getConfiguration: () => this.GET('configuration'),
    getCountries: () => this.GET('configuration/countries'),
    getJobs: () => this.GET('configuration/jobs'),
    getLanguages: () => this.GET('configuration/languages'),
    getPrimaryTranslations: () => this.GET('configuration/primary_translations'),
    getTimezones: () => this.GET('configuration/timezones'),
  };

  public account = {
    getInformation: (options: any) => this.GET('account', options),
    getLists: (options: any) => this.GET(`account/${options.id}/lists`, options),
    getFavoritesMovies: (options: any) => this.GET(`account/${options.id}/favorite/movies`, options),
    getFavoritesTvShows: (options: any) => this.GET(`account/${options.id}/favorite/tv?`, options),
    getRatedMovies: (options: any) => this.GET(`account/${options.id}/rated/movies`, options),
    getRatedTvShows: (options: any) => this.GET(`account/${options.id}/rated/tv`, options),
    getRatedTvEpisodes: (options: any) => this.GET(`account/${options.id}rated/tv/episodes`, options),
    getMovieWatchlist: (options: any) => this.GET(`account/${options.id}/watchlist/movies`, options),
    getTvShowsWatchlist: (options: any) => this.GET(`account/${options.id}/watchlist/tv`, options),
    addFavorite: (options: any) => {
      const body = {
        media_type: options.media_type,
        media_id: options.media_id,
        favorite: options.favorite,
      };
      return this.POST(`account/${options.id}/favorite`, body, options);
    },
    addToWatchlist: (options: any) => {
      const body = {
        media_type: options.media_type,
        media_id: options.media_id,
        watchlist: options.watchlist,
      };
      return this.POST(`account/${options.id}/watchlist`, body, options);
    },
  };

  public authentication = {
    askPermissions: (options: { token: string; redirect_to: string }) => {
      window.open('https://www.themoviedb.org/authenticate/' + options.token + '?redirect_to=' + options.redirect_to);
    },
    generateToken: () => this.GET('authentication/token/new'),
    validateUser: (options: any) => this.GET('authentication/token/validate_with_login', options),
    generateSession: (options: any) => this.GET('authentication/session/new', options),
    generateGuestSession: () => this.GET('authentication/guest_session/new'),
  };

  public certifications = {
    getMovieList: () => this.GET('certification/movie/list'),
    getTvList: () => this.GET('certification/tv/list'),
  };

  public changes = {
    getMovieChanges: (options: any) => this.GET('movie/changes', options),
    getPersonChanges: (options: any) => this.GET('person/changes', options),
    getTvChanges: (options: any) => this.GET('tv/changes', options),
  };

  public collections = {
    getDetails: (options: any) => this.GET(`collection/${options.id}`, options),
    getImages: (options: any) => this.GET(`collection/${options.id}/images`, options),
    getTranslations: (options: any) => this.GET(`collection/${options.id}/translations`, options),
  };

  public companies = {
    getDetails: (options: any) => this.GET(`company/${options.id}`, options),
    getAlternativeNames: (options: any) => this.GET(`company/${options.id}/alternative_names`, options),
  };

  public credits = {
    getDetails: (options: any) => this.GET(`credit/${options.id}`, options),
  };

  public discover = {
    getMovies: (options: any) => this.GET('discover/movie', options),
    getTvShows: (options: any) => this.GET('discover/tv', options),
  };

  public find = {
    getById: (options: any) => this.GET(`find/${options.id}`, options),
  };

  public genres = {
    getMovieList: (options: any) => this.GET('genre/movie/list', options),
    getMovies: (options: any) => this.GET(`genre/${options.id}/movies`, options),
    getTvList: (options: any) => this.GET('genre/tv/list', options),
  };

  public guestSession = {
    getRatedMovies: (options: any) => this.GET(`guest_session/${options.id}/rated/movies`, options),
    getRatedTvShows: (options: any) => this.GET(`guest_session/${options.id}/rated/tv`, options),
    getRatedTvEpisodes: (options: any) => this.GET(`guest_session/${options.id}/rated/tv/episodes`, options),
  };

  public keywords = {
    getById: (options: any) => this.GET(`keyword/${options.id}`, options),
    getMovies: (options: any) => this.GET(`keyword/${options.id}/movies`, options),
  };

  public lists = {
    getById: (options: any) => this.GET(`list/${options.id}`, options),
    getStatusById: (options: any) => this.GET(`list/${options.id}/item_status`, options),
    addList: (options: any) => {
      const body = {
        name: options.name,
        description: options.description,
        language: options.language,
      };

      delete options.name;
      delete options.description;

      if (options.hasOwnProperty('language')) {
        delete options.language;
      }

      return this.POST(`list`, body, options);
    },
    addItem: (options: any) => this.POST(`list/${options.id}/add_item`, { media_id: options.media_id }, options),
    removeItem: (options: any) => this.POST(`list/${options.id}/remove_item`, { media_id: options.media_id }, options),
    removeList: (options: any) => this.DELETE(`list/${options.id}`, {}, options),
    clearList: (options: any) => this.DELETE(`list/${options.id}/clear`, {}, options),
  };

  public movies = {
    getById: (options: any) => this.GET(`movie/${options.id}`, options),
    getAccountStates: (options: any) => this.GET(`movie/${options.id}/account_states`, options),
    getAccountStatesGuest: (options: any) => this.GET(`movie/${options.id}/account_states`, options),
    getAlternativeTitles: (options: any) => this.GET(`movie/${options.id}/alternative_titles`, options),
    getChanges: (options: any) => this.GET(`movie/${options.id}/changes`, options),
    getCredits: (options: any) => this.GET(`movie/${options.id}/credits`, options),
    getExternalIds: (options: any) => this.GET(`movie/${options.id}/external_ids`, options),
    getImages: (options: any) => this.GET(`movie/${options.id}/images`, options),
    getKeywords: (options: any) => this.GET(`movie/${options.id}/keywords`, options),
    getReleases: (options: any) => this.GET(`movie/${options.id}/release_dates`, options),
    getVideos: (options: any) => this.GET(`movie/${options.id}/videos`, options),
    getTranslations: (options: any) => this.GET(`movie/${options.id}/translations`, options),
    getRecommendations: (options: any) => this.GET(`movie/${options.id}/recommendations`, options),
    getSimilarMovies: (options: any) => this.GET(`movie/${options.id}/similar`, options),
    getReviews: (options: any) => this.GET(`movie/${options.id}/reviews`, options),
    getLists: (options: any) => this.GET(`movie/${options.id}/lists`, options),
    getLatest: (options: any) => this.GET(`movie/${options.id}/latest`, options),
    getUpcoming: (options: any) => this.GET('movie/upcoming', options),
    getNowPlaying: (options: any) => this.GET('movie/now_playing', options),
    getPopular: (options: any) => this.GET('movie/popular', options),
    getTopRated: (options: any) => this.GET('movie/top_rated', options),
    rate: (options: any, rate: Number) => this.POST(`movie/${options.id}/rating`, { value: rate }, options),
    rateGuest: (options: any, rate: Number) => this.POST(`movie/${options.id}/rating`, { value: rate }, options),
    removeRate: (options: any) => this.DELETE(`movie/${options.id}/rating`, {}, options),
    removeRateGuest: (options: any) => this.DELETE(`movie/${options.id}/rating`, {}, options),
  };

  public networks = {
    getById: (options: any) => this.GET(`network/${options.id}`, options),
    getAlternativeNames: (options: any) => this.GET(`network/${options.id}/alternative_names`, options),
  };

  public people = {
    getById: (options: any) => this.GET(`person/${options.id}`, options),
    getMovieCredits: (options: any) => this.GET(`person/${options.id}/movie_credits`, options),
    getTvCredits: (options: any) => this.GET(`person/${options.id}/tv_credits`, options),
    getCredits: (options: any) => this.GET(`person/${options.id}/combined_credits`, options),
    getExternalIds: (options: any) => this.GET(`person/${options.id}/external_ids`, options),
    getImages: (options: any) => this.GET(`person/${options.id}/images`, options),
    getTaggedImages: (options: any) => this.GET(`person/${options.id}/tagged_images`, options),
    getChanges: (options: any) => this.GET(`person/${options.id}/changes`, options),
    getPopular: (options: any) => this.GET('person/popular', options),
    getLatest: (options: any) => this.GET('person/latest', options),
  };

  public reviews = {
    getById: (options: any) => this.GET(`review/${options.id}`, options),
  };

  public search = {
    getMovie: (options: any) => this.GET('search/movie', options),
    getCollection: (options: any) => this.GET('search/collection', options),
    getTv: (options: any) => this.GET('search/tv', options),
    getPerson: (options: any) => this.GET('search/person', options),
    getCompany: (options: any) => this.GET('search/company', options),
    getKeyword: (options: any) => this.GET('search/keyword', options),
    getMulti: (options: any) => this.GET('search/multi', options),
  };

  public tv = {
    getById: (options: any) => this.GET(`tv/${options.id}`, options),
    getAccountStates: (options: any) => this.GET(`tv/${options.id}/account_states`, options),
    getAccountStatesGuest: (options: any) => this.GET(`tv/${options.id}/account_states`, options),
    getAlternativeTitles: (options: any) => this.GET(`tv/${options.id}/alternative_titles`, options),
    getChanges: (options: any) => this.GET(`tv/${options.id}/changes`, options),
    getContentRatings: (options: any) => this.GET(`tv/${options.id}/content_ratings`, options),
    getCredits: (options: any) => this.GET(`tv/${options.id}/credits`, options),
    getExternalIds: (options: any) => this.GET(`tv/${options.id}/external_ids`, options),
    getImages: (options: any) => this.GET(`tv/${options.id}/images`, options),
    getKeywords: (options: any) => this.GET(`tv/${options.id}/keywords`, options),
    getRecommendations: (options: any) => this.GET(`tv/${options.id}/recommendations`, options),
    getReviews: (options: any) => this.GET(`tv/${options.id}/reviews`, options),
    getScreenedTheatrically: (options: any) => this.GET(`tv/${options.id}/screened_theatrically`, options),
    getSimilar: (options: any) => this.GET(`tv/${options.id}/similar`, options),
    getTranslations: (options: any) => this.GET(`tv/${options.id}/translations`, options),
    getVideos: (options: any) => this.GET(`tv/${options.id}/videos`, options),
    getAiringToday: (options: any) => this.GET('tv/airing_today', options),
    getLatest: () => this.GET('tv/latest'),
    getOnTheAir: (options: any) => this.GET('tv/on_the_air', options),
    getPopular: (options: any) => this.GET('tv/popular', options),
    getTopRated: (options: any) => this.GET('tv/top_rated', options),
    rate: (options: any, rate: Number) => this.POST(`tv/${options.id}/rating`, { value: rate }, options),
    rateGuest: (options: any, rate: Number) => this.POST(`tv/${options.id}/rating`, { value: rate }, options),
    removeRate: (options: any) => this.DELETE(`tv/${options.id}/rating`, {}, options),
    removeRateGuest: (options: any) => this.DELETE(`tv/${options.id}/rating`, {}, options),
  };

  public tvSeasons = {
    getById: (options: any) => this.GET(`tv/${options.id}/season/${options.season_number}`, options),
    getChanges: (options: any) => this.GET(`tv/season/${options.id}/changes`, options),
    getAccountStates: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/account_states`, options),
    getAccountStatesGuest: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/account_states`, options),
    getCredits: (options: any) => this.GET(`tv/${options.id}/season/${options.season_number}/credits`, options),
    getExternalIds: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/external_ids`, options),
    getImages: (options: any) => this.GET(`tv/${options.id}/season/${options.season_number}/images`, options),
    getVideos: (options: any) => this.GET(`tv/${options.id}/season/${options.season_number}/videos`, options),
  };

  public tvEpisodes = {
    getById: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}`, options),
    getChanges: (options: any) => this.GET(`tv/episode/${options.id}/changes`, options),
    getAccountStates: (options: any) =>
      this.GET(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/account_states`,
        options
      ),
    getAccountStatesGuest: (options: any) =>
      this.GET(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/account_states`,
        options
      ),
    getCredits: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/credits`, options),
    getExternalIds: (options: any) =>
      this.GET(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/external_ids`,
        options
      ),
    getImages: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/images`, options),
    getVideos: (options: any) =>
      this.GET(`tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/videos`, options),
    rate: (options: any, rate: Number) =>
      this.POST(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/rating`,
        { value: rate },
        options
      ),
    rateGuest: (options: any, rate: Number) =>
      this.POST(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/rating`,
        { value: rate },
        options
      ),
    removeRate: (options: any) =>
      this.DELETE(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/rating`,
        {},
        options
      ),
    removeRateGuest: (options: any) =>
      this.DELETE(
        `tv/${options.id}/season/${options.season_number}/episode/${options.episode_number}/rating`,
        {},
        options
      ),
  };
}
