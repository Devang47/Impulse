import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PlaceholderMessage() {
  const [fact, setFact] = useState('')

  const getFact = () => {
    fetch('https://api.chucknorris.io/jokes/random')
      .then((response) => response.json())
      .then((response: any) => {
        setFact(response.value)
      })
      .catch((error: any) => {
        setFact('A unknown error occurred.')
      })
  }

  useEffect(() => {
    getFact()
  }, [])

  return (
    <motion.section
      animate={{
        opacity: [0, 1],
        transition: { duration: 0.2 },
      }}
      className="text-center text-accent flex flex-col items-center justify-center"
    >
      <h1 className="font-bold text-3xl w-full md:text-4xl">
        Welcome to <span className=" font-extrabold">Impulse.</span>
      </h1>
      <h2 className="w-10/12 md:w-8/12 mt-4 ">
        Why don't you start sending some messages to your other devices? We've
        designed our layout in such a way that it will help you be more
        productive.
      </h2>
      <h3 className="w-10/12 md:w-8/12 mt-6 ">
        but in case you are here to waste time, here's a random Chuck Norris
        fact to kill your time:
      </h3>
      <blockquote className="font-serif italic mt-3 py-4 px-6 bg-gray-200 w-9/12 md:w-6/12">
        "{fact}"
      </blockquote>
    </motion.section>
  )
}
