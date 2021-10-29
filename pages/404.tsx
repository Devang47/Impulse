import Router from 'next/router'
import { useEffect, useState } from 'react'

export default function Custom404() {
  const [remTime, setRemTime] = useState(5)

  useEffect(() => {
    const timer = setTimeout(() => {
      Router.push('/')
    }, 5000)

    let timerInterval = 5

    const interval = setInterval(() => {
      if (timerInterval >= 0) {
        setRemTime(timerInterval - 1)
        timerInterval -= 1
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="text-center text-msg_bg py-10 flex items-center justify-center flex-col">
      <h1 className="font-bold text-3xl block">404 - Page Not Found</h1>
      <h2 className="text-accent mt-4 block">
        Reditecting to homepage in {remTime}s
      </h2>
    </div>
  )
}
