import React, { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import Message from '../components/app/Message'
import ChatHeader from '../components/app/Header'
import ChatInput from '../components/app/Input'
import PlaceholderMessage from '../components/app/PlaceholderMsg'

import Router from 'next/router'
import { motion, useAnimation } from 'framer-motion'

import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import firebaseApp, { storage } from '../utils/firebase'
import {
  doc,
  setDoc,
  getFirestore,
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  deleteDoc,
  limitToLast,
} from 'firebase/firestore'

import { ref, deleteObject, listAll } from 'firebase/storage'

import CryptoJS from 'crypto-js'

const ChatUI = () => {
  const scroll = useRef<null | HTMLDivElement>(null)
  const [messages, setMessages] = useState<any[]>()

  const auth = getAuth(firebaseApp)
  const firestore = getFirestore(firebaseApp)
  const [user, loading, error] = useAuthState(auth)

  const [progress, setProgress] = useState(0)

  const [userDeviceDetails, setUserDeviceDetails] = useState('')

  let cryptedEmail: string
  if (user) {
    cryptedEmail = CryptoJS.SHA256(user.email).toString(CryptoJS.enc.Hex)
  }

  useEffect(() => {
    if (!user) {
      Router.push('/signin')
      return
    } else {
      handleUser()
    }

    if (error) {
      Router.push('/signin')
      return
    }

    console.log(
      '%c%s',
      'color: #001219; background: #E4F8FF; font-size: 32px; padding: 10px 10px; font-weight: 600; font-family: "Inter", sans-serif;',
      'Welcome to Impulse!!'
    )

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker Registered')
      })
    }

    setUserDeviceDetails(
      CryptoJS.SHA256(navigator.userAgent).toString(CryptoJS.enc.Hex)
    )
  })

  let limit = 15
  const getMessages = async () => {
    const dataCollection = collection(firestore, 'users', cryptedEmail, 'data')

    const dataQuery = query(
      dataCollection,
      orderBy('timestamp'),
      limitToLast(limit)
    )

    onSnapshot(dataQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()))
      scrollToBottom()
    })
  }

  const signOut = () => {
    auth.signOut()
  }

  const handleUser = async () => {
    const usersRef = doc(firestore, 'users', cryptedEmail)
    await setDoc(
      usersRef,
      {
        email: CryptoJS.SHA256(user.email).toString(CryptoJS.enc.Hex),
      },
      { merge: true }
    )

    getMessages()
  }

  const handleDelete = async (timestamp: number) => {
    const collectionRef = collection(firestore, 'users', cryptedEmail, 'data')

    const q = query(collectionRef, where('timestamp', '==', timestamp))

    const snapshot = await getDocs(q)
    const messageRef = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))

    messageRef.forEach(async (result) => {
      const docRef = doc(firestore, 'users', cryptedEmail, 'data', result.id)
      await deleteDoc(docRef)
    })
  }

  const deleteAllMessages = async () => {
    await deleteAnime.start({
      scale: [1, 0.95],
      opacity: [1, 0],
      transition: { duration: 0.2 },
      transitionEnd: {
        display: 'none',
      },
    })

    const filesRef = ref(storage, cryptedEmail + '/')
    const files = await listAll(filesRef)

    files.items.forEach(async (e) => {
      // @ts-ignore
      let path = e._location.path

      const filesRef = ref(storage, path)
      await deleteObject(filesRef)
        .then((e) => {
          console.log(
            '%c%s',
            'color: #001219; background: #E4F8FF; font-size: 18px; padding: 2px 4px; font-weight: 700;',
            'Success!'
          )
        })
        .catch((e) => {
          console.error(e)
        })
    })

    const collectionRef = collection(firestore, 'users', cryptedEmail, 'data')

    const q = query(collectionRef)

    const snapshot = await getDocs(q)
    const messageRef = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))

    messageRef.forEach(async (result) => {
      const docRef = doc(firestore, 'users', cryptedEmail, 'data', result.id)
      await deleteDoc(docRef)
    })
  }

  const scrollToBottom = () => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const loadMoreMessages = () => {
    limit += 15
    getMessages()
  }

  const deleteAnime = useAnimation()

  return (
    <>
      {user && (
        <section className="w-full h-full mx-auto custom_min_height bg-accent">
          <section className="rounded-md mx-auto h-full bg-chat_bg flex flex-col items-baseline relative max-w-5xl">
            <ChatHeader
              signOut={signOut}
              deleteAllMessages={deleteAllMessages}
              loadingProgress={progress}
              setLoadingProgress={setProgress}
            />
            <div className="messages w-full h-full overflow-scroll overflow-x-hidden py-25">
              <div className="py-20 px-4">
                {messages?.length ? (
                  <>
                    <motion.div
                      animate={deleteAnime}
                      className="flex flex-col gap-4"
                    >
                      {messages.length === 15 && (
                        <motion.button
                          title="load more messages"
                          aria-label="load more messages"
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.1 },
                          }}
                          whileTap={{
                            scale: 0.95,
                            transition: { duration: 0.1, damping: 0.05 },
                          }}
                          onClick={loadMoreMessages}
                          className="bg-accent font-medium py-2 px-4 w-min rounded-md mx-auto whitespace-nowrap mb-4"
                        >
                          Load more
                        </motion.button>
                      )}
                      {messages.map((details) => {
                        const recieved =
                          details.device === userDeviceDetails ? false : true
                        return (
                          <Message
                            user={user}
                            message={details.message}
                            timestamp={details.timestamp}
                            key={details.timestamp}
                            received={recieved}
                            handleDelete={handleDelete}
                          />
                        )
                      })}
                    </motion.div>
                  </>
                ) : (
                  <>
                    <PlaceholderMessage />
                  </>
                )}
                <div ref={scroll}></div>
              </div>
            </div>
            <ChatInput
              setLoadingProgress={setProgress}
              user={user}
              scrollToBottom={scrollToBottom}
            />
          </section>
        </section>
      )}
    </>
  )
}

function App() {
  return (
    <>
      <Head>
        <title>Impulse</title>
      </Head>

      <motion.div
        animate={{ opacity: [0, 1], transition: { duration: 0.5 } }}
        className="flex h-full"
        style={{ opacity: 0 }}
      >
        <ChatUI />
      </motion.div>
    </>
  )
}

export default App
