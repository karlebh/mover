import React, { useContext, useEffect, useState } from "react"
import moment from "moment/moment"
import { Link, useNavigate } from "react-router-dom"
import { MovieContext } from "../context/MovieContext"
import ReactPlaceholder from "react-placeholder/lib"
import Loader from "../components/Loader"
import { LazyLoadImage } from "react-lazy-load-image-component"

const ComingSoon = () => {
  const { getComingSoon, comingSoon, getGenre } = useContext(MovieContext)
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(4)

  const navigate = useNavigate()

  useEffect(() => {
    if (!comingSoon.length) {
      setLoading(true)
      getComingSoon()
      setLoading(false)
    }
  }, [])

  return (
    <section className="lg:px-10 w-full lg:min-w-[80%] mb-14 bg-natural-500 overflow-hidden">
      <ReactPlaceholder
        showLoadingAnimation
        type="media"
        rows={7}
        ready={!loading}
        customPlaceholder={Loader}
      >
        <div className="flex items-baseline mt-5">
          <h2 className="font-bold text-gray-300">Coming Soon</h2>
          <span className="ml-16 rounded-lg w-8 h-3.5 bg-amber-900 inline-block"></span>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {comingSoon.map((movie, id) => (
            <Link to={`/movie/${movie.slug}/${movie.id}`} key={id}>
              <div
                className={`flex-shrink-0 rounded-lg bg-zinc-800 lg:hover:scale-105 cursor-pointer lg:transition-all lg:duration-500  `}
              >
                <LazyLoadImage
                  effect="blur"
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
        {pageCount >= comingSoon.length || (
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
      </ReactPlaceholder>
    </section>
  )
}

export default ComingSoon
