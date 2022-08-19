import { motion, useAnimation } from "framer-motion";
import { encrypt, decrypt } from "../../utils/encrypt";
import CryptoJS from "crypto-js";
import ForMsg from "../../utils/ForMsg";

const Message = ({ user, message, received, timestamp, handleDelete }) => {
  const exTime = {
    hours: getHours(new Date(parseInt(timestamp)).getHours()),
    minutes: getMinutes(new Date(parseInt(timestamp)).getMinutes()),
    meridian: getMer(new Date(parseInt(timestamp)).getHours()),
    day: new Date(parseInt(timestamp)),
  };

  function getHours(hours) {
    return hours > 12 ? hours - 12 : hours;
  }

  function getMinutes(minutes) {
    return minutes > 10 ? minutes : "0" + minutes;
  }

  function getMer(hours) {
    return hours < 12 ? "am" : "pm";
  }

  const deleteAnime = useAnimation();

  const decryptMessages = (message) => {
    const key = timestamp + user.email + user.uid;
    const encryptedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
    const decryptedMessage = decrypt(encryptedKey, message);

    return decryptedMessage;
  };

  async function deleteMessage(timestamp) {
    await deleteAnime.start({
      scale: [1, 0.95],
      opacity: [1, 0],
      transition: { duration: 0.2 },
      transitionEnd: {
        display: "none",
      },
    });
    handleDelete(timestamp);
  }

  return (
    <motion.div animate={deleteAnime}>
      <motion.div
        animate={{
          scale: [0.9, 1],
          transition: { duration: 0.3, damping: 0.2 },
        }}
        className={`py-2.5 px-4 rounded-md max-w-xl message_box shadows-lg pb-2 relative pr-16 message_bg group ${
          !received && "ml-auto "
        }`}
      >
        <span>
          <p className="pr-1 break-words">
            <ForMsg input={decryptMessages(message)} />
          </p>
        </span>
        <span className="time absolute bottom-1 right-2 text-xs text-time ">
          {`${exTime.hours}:${exTime.minutes} ${exTime.meridian}`}
        </span>

        <button
          title="delete"
          aria-label="delete "
          className="absolute delete_button lg:opacity-0 lg:group-hover:opacity-100 "
          onClick={() => deleteMessage(timestamp)}
        >
          <CrossIcon />
        </button>
      </motion.div>
    </motion.div>
  );
};

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      width="12"
      height="12"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 64 64"
    >
      <path d="M62 10.571L53.429 2L32 23.429L10.571 2L2 10.571L23.429 32L2 53.429L10.571 62L32 40.571L53.429 62L62 53.429L40.571 32z" />
    </svg>
  );
}

export default Message;
