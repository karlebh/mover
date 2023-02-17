import React, { useEffect, useState } from "react"
import moment from "moment/moment"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

const WatchList = () => {
  const [pageCount, setPageCount] = useState(4)
  const localGenres = localStorage.genres ? JSON.parse(localStorage.genres) : []
  const localMovies = localStorage.watchlist
    ? JSON.parse(localStorage.watchlist)
    : []
  const [movies, setWatchlist] = useState(localMovies)
  const [genres, setGenres] = useState(localGenres)
  const IMAGE_URL = "https://image.tmdb.org/t/p/original"
  const navigate = useNavigate()

  useEffect(() => {
    const watchlist = async () => {
      if (!movies.length)
        await axios
          .get(
            "https://api.themoviedb.org/3/movie/now_playing?api_key=7316fba02f75311274d240dc8ac61a66&language=en-US&page=1"
          )
          .then(res => {
            let data = res.data.results
            const IMAGE_URL = "https://image.tmdb.org/t/p/original"
            data.forEach(movie => {
              let slug = movie.original_title
                .replaceAll(" ", "-")
                .replaceAll(":", "")
                .replaceAll(",", "")
                .toLowerCase()
              movie.poster_path = IMAGE_URL + movie.poster_path
              movie.backdrop_path = IMAGE_URL + movie.backdrop_path
              Object.assign(movie, { slug })
            })
            setWatchlist([...data])
            localStorage.setItem("watchlist", JSON.stringify(data))
            let prevData = JSON.parse(localStorage.movies)
            let newData = [...prevData, ...data]
            localStorage.setItem('movies', JSON.stringify(newData))
          })
          .catch(err => err.message)
    }
    watchlist()
  }, [])

  function getGenre(id) {
    return genres.find(genre => id == genre.id).name
  }

  return (
    <div>
      {" "}
      <section>
        <div className="flex items-baseline mt-5">
          <h2 className="font-bold text-gray-300">Watchlist</h2>
          <span className="ml-16 rounded-lg w-8 h-3.5 bg-amber-900 inline-block"></span>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {movies.map((movie, id) => (
            <Link to={`/movie/${movie.slug}/${movie.id}`} key={id}>
              <div
                className={`flex-shrink-0 rounded-lg bg-zinc-800 lg:hover:scale-105 cursor-pointer lg:transition-all lg:duration-500  `}
              >
                <img
                  src={`${movie.backdrop_path}`}
                  className="w-full min-h-[12rem] object-cover rounded-t-lg"
                  alt=""
                />
                <div className="px-3 h-32 overflow-hidden mt-3 flex flex-col justify-evenly">
                  <h1 className="font-bold text-sm text-zinc-300 text-left mb-3 ">
                    {movie.title}
                  </h1>
                  <div>
                    <p className="text-sm text-zinc-500">
                      {" "}
                      <span>Released Date:</span>{" "}
                      {moment(movie.release_date).format("ll")}
                    </p>
                    <p>
                      {movie.genre_ids.slice(0, 3).map((id, index) => (
                        <span
                          key={id}
                          className="text-zinc-500 font-bold text-xs mr-1.5 text-left"
                        >
                          {getGenre(id)}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {pageCount >= movies.length || (
          <div className="flex justify-center items-center mt-10 mb-10">
            <br />
            <button
              onClick={() => setPageCount(prevCount => prevCount + 2)}
              className="text-xl font-bold px-3 py-2 rounded-lg bg-zinc-200 text-zinc-800 md:hidden"
            >
              Load More
            </button>
            <button
              onClick={() => setPageCount(prevCount => prevCount + 3)}
              className="text-xl font-bold px-3 py-2 rounded-lg bg-zinc-200 text-zinc-800 hidden md:inline-block lg:hidden"
            >
              Load More
            </button>
            <button
              onClick={() => {
                window.scrollTo(0, document.body.scrollHeight)
                setPageCount(prevCount => prevCount + 4)
              }}
              className="text-xl font-bold px-3 py-2 rounded-lg bg-zinc-200 text-zinc-800 hidden lg:inline-block"
            >
              Load More
            </button>
          </div>
        )}
      </section>{" "}
    </div>
  )
}

export default WatchList
