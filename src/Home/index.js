import {Link} from 'react-router-dom'
import {useEffect, useState, useContext} from 'react'
import Loader from 'react-loader-spinner'
import MovieContext from '../context'

import './index.css'

const responseList = {
  isSuccess: 'SUCCESS',
  isLoading: 'LOADING',
  isFailure: 'FAILURE',
}

const Popularcard = props => {
  const {updateMovieId} = useContext(MovieContext)
  const {eachmovie} = props
  const {title, moviePoster, id, rating} = eachmovie
  const imageUrl = `https://image.tmdb.org/t/p/w300/${moviePoster}`

  const onMovieTabClick = () => {
    updateMovieId(id)
  }

  return (
    <li className="li-home-element">
      <img className="li-image-element" src={imageUrl} />
      <p className="li-para-element">{title}</p>
      <p className="li-rating-element">
        <span className="span-style">RATING: </span>
        {Math.round(rating * 10) / 10}
      </p>
      <Link
        className="each-link-card"
        onClick={onMovieTabClick}
        to={`/movies/${id}`}
      >
        <button className="view-detail">View Details</button>
      </Link>
    </li>
  )
}

const Home = () => {
  const [moviesObj, updateMovieObj] = useState({
    movieData: [],
    responseStatus: responseList.isLoading,
  })

  useEffect(() => {
    const fetchDetailsHome = async () => {
      const urlhome =
        'https://api.themoviedb.org/3/movie/popular?api_key=883ef4828cba3f4d12947e02c71d11b3&language=en-US&page=1'
      try {
        const response = await fetch(urlhome)
        if (response.ok) {
          const data = await response.json()
          const {results} = data
          console.log(results)
          const updatedResultsList = results.map(eachitem => {
            return {
              title: eachitem.title,
              moviePoster: eachitem.poster_path,
              rating: eachitem.vote_average,
              id: eachitem.id,
            }
          })
          updateMovieObj({
            movieData: updatedResultsList,
            responseStatus: responseList.isSuccess,
          })
        }
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchDetailsHome()
  }, [])

  const getCorrectSection = () => {
    switch (moviesObj.responseStatus) {
      case responseList.isLoading:
        return (
          <div className="Loader-class">
            <Loader type="Oval" color="#e0d666" />
          </div>
        )

      case responseList.isSuccess:
        return (
          <ul className="ul-container">
            {moviesObj.movieData.map(eachitem => (
              <Popularcard eachmovie={eachitem} key={eachitem.id} />
            ))}
          </ul>
        )
    }
  }

  return <div className="home-main-container">{getCorrectSection()}</div>
}

export default Home
