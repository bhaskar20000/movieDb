import {useState} from 'react'
import {Route, Switch, BrowserRouter} from 'react-router-dom'

import './App.css'
import MovieContext from './context'

import Navbar from './Navbar'
import Home from './Home'
import Toprated from './TopRated'
import Upcoming from './Upcoming'
import SingleMovie from './SingleMovie'
import SearchPage from './SearchMovie'

// write your code here
const App = () => {
  const [currentMovieObj, updateMovie] = useState({
    movieId: 0,
    searchData: '',
  })

  const updateMovieId = value => {
    updateMovie(prev => ({
      ...prev,
      movieId: value,
    }))
  }

  const updateSearchValue = value => {
    updateMovie(prev => ({
      ...prev,
      searchData: value,
    }))
  }

  return (
    <MovieContext.Provider
      value={{
        currentMovieObj,
        updateMovieId,
        updateSearchValue,
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/top-rated" component={Toprated} />
          <Route exact path="/upcoming" component={Upcoming} />
          <Route exact path="/movies/search" component={SearchPage} />
          <Route exact path="/movies/:movieid" component={SingleMovie} />
        </Switch>
      </BrowserRouter>
    </MovieContext.Provider>
  )
}

export default App
