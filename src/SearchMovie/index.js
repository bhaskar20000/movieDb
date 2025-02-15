import {useState, useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import MovieContext from '../context'

import './index.css'

const SearchPage = () => {
  const [searchMovieList, updateSearchList] = useState({})
  const {currentMovieObj, updateMovieId} = useContext(MovieContext)
  const {searchData} = currentMovieObj

  useEffect(() => {
    const fetchSearchDetails = async () => {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=883ef4828cba3f4d12947e02c71d11b3&language=en-US&query=${searchData}&page=1`
      try {
        const response = await fetch(searchUrl)
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          const {results} = data
          console.log(results)

          const updatedResultsList = {
            title: results[0].title,
            moviePoster: results[0].poster_path,
            rating: results[0].vote_average,
            id: results[0].id,
          }
          updateSearchList(updatedResultsList)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
    fetchSearchDetails()
  }, [])

  const {title, moviePoster, id, rating} = searchMovieList

  const imageUrl = `https://image.tmdb.org/t/p/w300/${moviePoster}`

  const onMovieTabClick = () => {
    updateMovieId(id)
  }

  console.log(searchMovieList)
  return (
    <div className="li-home-element-random">
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
    </div>
  )
}

export default SearchPage
