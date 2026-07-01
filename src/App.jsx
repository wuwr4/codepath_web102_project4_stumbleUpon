
import "./App.css"

import React from "react";
import { useState } from "react";

import Genre from "./components/Genre";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const POSTER_ROOT = "https://image.tmdb.org/t/p/w300";

const App = () => {

  const [show, setShow] = useState({
    title: "",
    genres: [],
    numSeasons: 0, 
    numEpisodes: 0,
    summary: "",
    posterURL: ""
  });

  const [bannedGenres, setBannedGenres] = useState([]);

  const extractGenres = (resp) => {
    let genres = []
    for (const genre of resp.genres) {
      genres.push(genre.name)
    }

    return genres
  }

  const getAdditionalInfo = (showID) => {

    const request = `https://api.themoviedb.org/3/tv/${showID}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    return fetch(request, options)
      .then((res) => res.json())
      .then((data) => ([
        extractGenres(data),
        data.number_of_seasons,
        data.number_of_episodes,
      ]))
      .catch((err) => {
        console.error(err);
        return null;
      });
  };

  const updateShow = async (resp) => {

    let showName = resp.name
    let showSummary = resp.overview
    let poster = POSTER_ROOT + resp.poster_path
    
    let [genresList, num_seasons, num_episodes] = await getAdditionalInfo(resp.id)

    
    setShow({
      title: showName,
      genres: genresList,
      numSeasons: num_seasons, 
      numEpisodes: num_episodes,
      summary: showSummary,
      posterURL: poster
    })
  }

  const getNewShow = () => {

    const randomPage = Math.floor(Math.random() * 500);
    const randomIndex = Math.floor(Math.random() * 20);
    const request = `https://api.themoviedb.org/3/tv/popular?page=${randomPage}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    fetch(request, options)
      .then(res => res.json())
      .then(res => updateShow(res.results[randomIndex]))
      .catch(err => console.error(err));
  }

  const handleGenreClick = (genreName) => {
    setBannedGenres((prevGenres) => {
      if (prevGenres.includes(genreName)) {
        return prevGenres.filter((genre) => genre !== genreName);
      }

      return [...prevGenres, genreName];
    })
  }


  return (
    <div className="app">

      <div className="movie-info">

        <div className="poster">
          <img src={show.posterURL} />
          <button onClick={getNewShow}> New Show </button>
        </div>

        {show.title && 
          <div className="info">
            <h1 className="title"> {show.title} </h1>

            <div className="genres">
              {show.genres.map((genre) => (<Genre key={genre} name={genre} handler={handleGenreClick}/>))}
            </div>

            <h3 className="stats"> Number of Seasons: {show.numSeasons} </h3>
            <h3 className="stats"> Number of Episodes: {show.numEpisodes} </h3>
            <p className="summary"> {show.summary} </p>
          </div>
        }

      </div>

      <div className="banned-genres">
        <h2 className="title"> Banned Genres </h2>

        <div className="genres">
          {bannedGenres.map((genre) => (<Genre key={genre} name={genre} handler={handleGenreClick}/>))}
        </div>
      </div>


    </div>
  )
}

export default App
