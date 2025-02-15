import {useContext, useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import MovieContext from '../context'
import {v4 as uuidv4} from 'uuid'
import './index.css'

const statusObj = {
  isSuccess: 'SUCCESS',
  isLoading: 'LOADING',
}

const SingleMovie = () => {
  const [responseObj, updateResponse] = useState({
    movieDetailsObj: {},
    castDetailsList: [],
    crewDetailsList: [],
    responseStatus: statusObj.isLoading,
  })

  const CastItem = props => {
    const {eachcast} = props
    const {actorName, actorUrl, actorRole} = eachcast

    const imageUrl = `https://image.tmdb.org/t/p/w300/${actorUrl}`

    return (
      <li className="cast-li-item">
        <p className="cast-actor-name">{`${actorName} as ${actorRole}`}</p>
        <img className="cast-image" src={imageUrl} alt="cast" />
      </li>
    )
  }

  const CrewItem = props => {
    const {eachcrew} = props
    const {crewName, crewDepartment, crewProfile} = eachcrew
    const imageUrl = `https://image.tmdb.org/t/p/w300/${crewProfile}`
    return (
      <li className="crew-li">
        <p className="crew-para">{crewName}</p>
        <p className="crew-department">{`Department : ${crewDepartment}`}</p>
        <img className="crew-image" src={imageUrl} alt="crew" />
      </li>
    )
  }

  const {currentMovieObj} = useContext(MovieContext)
  const {movieId} = currentMovieObj
  const {title, imagePath, rating, duration, genre, date, description} =
    responseObj.movieDetailsObj

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=883ef4828cba3f4d12947e02c71d11b3&language=en-US`
      try {
        const response = await fetch(movieUrl)
        if (response.ok) {
          const data = await response.json()
          const modifiedMovieDetails = {
            title: data.title,
            imagePath: data.poster_path,
            rating: data.vote_average,
            duration: data.runtime,
            genre: data.genres,
            date: data.release_date,
            description: data.overview,
          }

          updateResponse(prevState => ({
            ...prevState,
            movieDetailsObj: modifiedMovieDetails,
            responseStatus: statusObj.isSuccess,
          }))
        }
      } catch (e) {
        console.log(e.message)
      }
    }

    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  useEffect(() => {
    const fetchCastDetails = async () => {
      const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=883ef4828cba3f4d12947e02c71d11b3&language=en-US`
      try {
        const response = await fetch(castUrl)
        if (response.ok) {
          const data = await response.json()
          const {cast, crew} = data
          const updatedCast = cast.map(eachItem => ({
            actorName: eachItem.name,
            actorUrl: eachItem.profile_path,
            actorRole: eachItem.character,
            id: uuidv4(),
          }))

          const updatedCrew = crew.map(eachItem => ({
            crewName: eachItem.name,
            crewDepartment: eachItem.known_for_department,
            crewProfile: eachItem.profile_path,
            id: uuidv4(),
          }))

          updateResponse(prevState => ({
            ...prevState,
            castDetailsList: updatedCast,
            crewDetailsList: updatedCrew,
            responseStatus: statusObj.isSuccess,
          }))
        }
      } catch (e) {
        console.log(e.message)
      }
    }

    if (movieId) {
      fetchCastDetails()
    }
  }, [movieId])

  useEffect(() => {
    console.log('Updated responseObj:', responseObj)
  }, [responseObj])

  const getCorrectSection = () => {
    switch (responseObj.responseStatus) {
      case statusObj.isLoading:
        return (
          <div className="Loader-class">
            <Loader type="Oval" color="#e0d666" />
          </div>
        )
      case statusObj.isSuccess:
        const imageUrl = `https://image.tmdb.org/t/p/w300/${imagePath}`

        return (
          <div className="details-main-container">
            <div className="movie-details-container">
              <h1 className="movie-details-heading">Movie details</h1>
              <h1 className="movie-title">{title}</h1>
              <div className="actual-movie-details-container">
                <div className="image-div-random">
                  <img className="movie-image" src={imageUrl} alt="movie" />
                </div>
                <div className="right-container-rndom">
                  <p className="movie-rating">{`Rating : ${rating}`}</p>
                  <p className="movir-duration">{`Duration : ${duration} mins`}</p>
                  <p className="genre-heading">Genre</p>
                  {genre === undefined ? null : (
                    <ul className="ul-genre">
                      {genre.map(eachItem => (
                        <li key={eachItem.id}>
                          <p className="each-para-genre">{eachItem.name}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="date">{`Realse Date : ${date}`}</p>
                  <p className="movie-description">{`Description : ${description}`}</p>
                </div>
              </div>
            </div>
            <div className="bottom-container">
              <h1 className="cast-details-heading">Cast details</h1>
              <ul className="cart-ul-container">
                {responseObj.castDetailsList.map(eachitem => (
                  <CastItem eachcast={eachitem} key={eachitem.id} />
                ))}
              </ul>
              <h1 className="crew-heding">Crew details</h1>
              <ul className="crew-ul-container">
                {responseObj.crewDetailsList.map(eachItem => (
                  <CrewItem eachcrew={eachItem} key={eachItem.id} />
                ))}
              </ul>
            </div>
          </div>
        )
    }
  }

  return <div className="outer-random-container">{getCorrectSection()}</div>
}

export default SingleMovie
