import React, { useEffect, useState, useContext } from "react"
import { useLocation, useParams } from "react-router"
import moment from "moment/moment"
import { MovieContext } from "../context/MovieContext"
import ReactPlaceholder from "react-placeholder/lib"
import Loader from "../components/Loader"
import { LazyLoadImage } from "react-lazy-load-image-component"

const Details = () => {
  const { id } = useParams()

  const { getGenre, getMovieCredit, credits, imagify } =
    useContext(MovieContext)
  const [movie, setMovie] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getMovie(id) {
      setLoading(true)
      await axios
        .get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=7316fba02f75311274d240dc8ac61a66&language=en-US`
        )
        .then(res => {
          setMovie(...Array(res.data))
          setLoading(false)
        })
    }
    getMovie(id)
    setLoading(true)
    getMovieCredit(id)
    setLoading(false)
  }, [movie, credits])

  return (
    <div className="lg:px-10 w-full lg:min-w-[80%] mb-14 bg-natural-500 overflow-hidden">
      <ReactPlaceholder
        showLoadingAnimation
        type="media"
        rows={7}
        ready={!loading}
        customPlaceholder={Loader}
      >
        <div className="mt-5 text-center mb-10">
          <h1 className="font-bold font-sans text-4xl my-5">
            {movie.original_title}
          </h1>

          <LazyLoadImage
            effect="blur"
            src={imagify(movie.poster_path)}
            className="w-full h-full rounded-lg mx-auto"
            alt=""
          />
          <div className="mt-4">
            {movie?.genre_ids?.map(id => (
              <span key={id} className="text-xl font-semibold mr-5">
                {getGenre(id)}
              </span>
            ))}
          </div>

          <div className="mt-3 text-lg text-amber-500 font-normal">
            {movie.vote_average?.toFixed(0)} / 10 based on {movie.vote_count}{" "}
            votes
          </div>

          <p className="text-zinc-500 text-xl mt-5">
            <span>Released Date:</span>{" "}
            {moment(movie.release_date).format("ll")}
          </p>

          <div className="mt-7 font-semibold text-md text-justify lg:px-4 text-neutral-400">
            {movie.overview}
          </div>

          <h1 className="mt-5 font-sans text-2xl">Credits</h1>

          <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-2 lg:px-4">
            {credits.slice(0, 16).map((cast, id) => (
              <div
                key={id}
                className={`flex-shrink-0 flex flex-col overflow-hidden rounded-lg bg-zinc-800 lg:hover:scale-105 lg:cursor-pointer lg:transition-all lg:duration-500  `}
              >
                <LazyLoadImage
                  effect="blur"
                  src={`${cast.profile_path}`}
                  className="h-[15rem] min-h-[12rem] w-full rounded-t-lg"
                  alt=""
                />
                <div className="px-3 h-32 overflow-hidden mt-3 flex flex-col justify-evenly">
                  <h1 className="font-bold text-sm text-zinc-300 text-left mb-3 ">
                    {cast.original_name}
                  </h1>

                  <h1 className="text-sm text-zinc-300 text-left mb-3 ">
                    {cast.character}
                  </h1>

                  <div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ReactPlaceholder>
    </div>
  )
}

export default Details
