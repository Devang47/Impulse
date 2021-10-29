import { useState, useEffect } from 'react'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import firebaseApp, { storage } from '../../utils/firebase'
import CryptoJS from 'crypto-js'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import { encrypt } from '../../utils/encrypt'

const ChatInput = ({
  user,
  scrollToBottom,
  setLoadingProgress,
}: {
  user: any
  scrollToBottom: Function
  setLoadingProgress: any
}) => {
  const [input, changeInput] = useState('')
  const [file, setFile] = useState<any>()

  const firestore = getFirestore(firebaseApp)

  const [email, setEmail] = useState('')
  const [deviceDetails, setDeviceDetails] = useState('')

  useEffect(() => {
    setEmail(CryptoJS.SHA256(user.email).toString(CryptoJS.enc.Hex))

    setDeviceDetails(
      CryptoJS.SHA256(navigator.userAgent).toString(CryptoJS.enc.Hex)
    )
  }, [])

  useEffect(() => {
    if (!file) return

    const cryptedEmail = CryptoJS.SHA256(user.email).toString(CryptoJS.enc.Hex)
    const storageRef = ref(
      storage,
      cryptedEmail + '/' + CryptoJS.SHA256(file.name).toString(CryptoJS.enc.Hex)
    )

    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.log('Bytes to transfer: ' + snapshot.totalBytes)
        if (snapshot.totalBytes > 10485760) {
          uploadTask.cancel()
          changeInput('Error: File is too large (limit 10mb)')
          console.log(
            '%c%s',
            'color: #e63946; background: #E4F8FF; font-size: 18px; padding: 2px 4px; font-weight: 700;',
            'ERROR!'
          )
          console.error('Error: File is too large (limit 10mb)')
          return
        }
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setLoadingProgress(progress)
      },
      (error) => {
        console.log(
          '%c%s',
          'color: #e63946; background: #E4F8FF; font-size: 18px; padding: 2px 4px; font-weight: 700;',
          'ERROR!'
        )
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((e) => {
          console.log(
            '%c%s',
            'color: #001219; background: #E4F8FF; font-size: 18px; padding: 2px 4px; font-weight: 700;',
            'Success!'
          )
          console.log('Download url: ' + e)
          changeInput(input + ' ' + e)
        })
      }
    )
  }, [file])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (input.trim()) {
      const timestamp = Date.now().toString()

      const key = timestamp + user.email + user.uid
      const encryptedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex)

      const encryptedMessage = encrypt(encryptedKey, input)

      const collectionRef = collection(firestore, 'users', email, 'data')
      const payload = {
        message: encryptedMessage,
        timestamp,
        device: deviceDetails,
      }

      changeInput('')
      await addDoc(collectionRef, payload)

      scrollToBottom()
    }
  }

  return (
    <section className="group mt-auto py-3 px-4 rounded-md z-10 w-full gap-4 md:pb-6 flex items-center justify-center ">
      <div className="bg-msg_bg rounded py-1 ring-accent focus:ring-1  w-full apply_shadow pr-20 relative shadow-md input_box">
        <form action="null" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => changeInput(e.target.value)}
            className="bg-msg_bg w-full pr-3 md:pr-10 outline-none px-5 py-2.5 md:py-3 md:px-6 rounded"
            placeholder="Start typing..."
          />
          <label
            htmlFor="file-upload"
            title="Upload files"
            aria-label="Upload files"
            className="file-upload p-0.5 rounded absolute right-14 top-2 md:top-2.5 apply_shadow shadow-md text-accent cursor-pointer"
          >
            <AttachBtn />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            title="Enter message here"
            onChange={(e) => {
              if (e.target.files) setFile(e.target.files[0])
            }}
          />

          <button
            title="Send message"
            aria-label="Send message"
            className="p-2 rounded bg-chat_bg absolute right-3 top-2 md:top-2.5 apply_shadow shadow-md submit_btn"
          >
            <SendButton />
          </button>
        </form>
      </div>
    </section>
  )
}

function AttachBtn() {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3:45)">
        <path
          d="M18.208 21.3672L21.9766 14.8398C22.7179 13.5559 22.9188 12.0301 22.5351 10.598C22.1514 9.16596 21.2145 7.945 19.9305 7.20372C18.6466 6.46244 17.1208 6.26156 15.6887 6.64527C14.2567 7.02899 13.0357 7.96587 12.2945 9.2498L7.63611 17.3183C7.14193 18.1742 7.00801 19.1915 7.26382 20.1462C7.51963 21.1008 8.14421 21.9148 9.00017 22.409C9.85613 22.9032 10.8733 23.0371 11.828 22.7813C12.7827 22.5255 13.5967 21.9009 14.0909 21.045L18.3682 13.6365C18.4905 13.4246 18.5699 13.1906 18.6019 12.948C18.6338 12.7054 18.6177 12.4589 18.5543 12.2225C18.491 11.9862 18.3817 11.7646 18.2328 11.5705C18.0838 11.3764 17.8981 11.2135 17.6862 11.0911V11.0911C17.2582 10.844 16.7496 10.7771 16.2722 10.905C15.7949 11.0329 15.3879 11.3452 15.1408 11.7731L11.7952 17.5679"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3:45">
          <rect
            width="22.36"
            height="22.36"
            fill="white"
            transform="translate(19.3644 30.5444) rotate(-150)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

function SendButton() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.5869 0.413087C13.511 0.337528 13.4151 0.285214 13.3104 0.262296C13.2058 0.239377 13.0968 0.246807 12.9962 0.283712L0.62125 4.78371C0.514526 4.82419 0.422643 4.89618 0.357804 4.99012C0.292965 5.08406 0.25824 5.19551 0.25824 5.30965C0.25824 5.42379 0.292965 5.53524 0.357804 5.62918C0.422643 5.72312 0.514526 5.79511 0.62125 5.83559L5.45312 7.76496L9.01937 4.18746L9.8125 4.98059L6.22937 8.56371L8.16437 13.3956C8.20606 13.5003 8.27821 13.59 8.37148 13.6532C8.46475 13.7164 8.57484 13.7501 8.6875 13.75C8.80117 13.7476 8.91147 13.7109 9.00385 13.6446C9.09624 13.5784 9.16637 13.4856 9.205 13.3787L13.705 1.00371C13.7433 0.904193 13.7526 0.795829 13.7317 0.691257C13.7107 0.586684 13.6605 0.490211 13.5869 0.413087Z" />
    </svg>
  )
}

export default ChatInput
