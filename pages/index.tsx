import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import LandingPage from '../components/LandingPage'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Impulse | Devang Saklani</title>
      </Head>
      <LandingPage />
    </>
  )
}

export default Home
