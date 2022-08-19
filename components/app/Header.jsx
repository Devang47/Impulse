import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoadingBar from "react-top-loading-bar";

const ChatHeader = ({
  signOut,
  deleteAllMessages,
  loadingProgress,
  setLoadingProgress,
}) => {
  const [hiddenNav, setHiddenNav] = useState(false);
  const [installBtn, setInstallBtn] = useState(false);

  const prompt = () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setInstallBtn(false);
        if (choiceResult.outcome === "accepted") {
          console.log("user accepted the A2HS prompt");
          deferredPrompt = null;
        }
      });
    }
  };

  let deferredPrompt;
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setInstallBtn(true);
    });
  });

  return (
    <header className="chatbox_header backdrop-filter bg-chat_bg shadow py-3 bg-opacity-80 backdrop-blur-sm px-4 rounded-md flex items-center justify-between z-10 w-full relative">
      <button
        title="logo"
        aria-label="logo"
        className="bg-msg_bg px-3 py-2 font-medium rounded-md apply_shadow"
      >
        Impulse
      </button>
      <div className="relative flex items-center justify-center">
        {installBtn && (
          <motion.button
            animate={{
              opacity: [0, 1],
              y: [-10, 0],
              transition: { duration: 0.2 },
            }}
            className="py-2 text-msg_bg active:bg-gray-200  px-4 duration-100 border-gray-200 border rounded-md hover:bg-gray-200"
            onClick={prompt}
          >
            Install
          </motion.button>
        )}
        <button
          title="options"
          aria-label="options"
          onClick={() => setHiddenNav(!hiddenNav)}
          className="py-2 text-msg_bg active:bg-gray-200 rounded-full px-4 duration-100"
        >
          <svg
            width="6"
            height="20"
            viewBox="0 0 6 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.9412 8.25C1.51767 8.25 0.352966 9.4875 0.352966 11C0.352966 12.5125 1.51767 13.75 2.9412 13.75C4.36473 13.75 5.52944 12.5125 5.52944 11C5.52944 9.4875 4.36473 8.25 2.9412 8.25ZM2.9412 0C1.51767 0 0.352966 1.2375 0.352966 2.75C0.352966 4.2625 1.51767 5.5 2.9412 5.5C4.36473 5.5 5.52944 4.2625 5.52944 2.75C5.52944 1.2375 4.36473 0 2.9412 0ZM2.9412 16.5C1.51767 16.5 0.352966 17.7375 0.352966 19.25C0.352966 20.7625 1.51767 22 2.9412 22C4.36473 22 5.52944 20.7625 5.52944 19.25C5.52944 17.7375 4.36473 16.5 2.9412 16.5Z"
              fill="#1D3557"
            />
          </svg>
        </button>

        {hiddenNav && (
          <>
            <motion.div
              animate={{
                translateY: [-5, 15],
                translateX: [-40, -40],
                opacity: [0, 1],
                transition: { duration: 0.2 },
              }}
              className="absolute left-0 top-full transform -translate-x-1/2 translate-y-4 bg-accent rounded-md w-min"
            >
              <button
                title="delete all messages"
                aria-label="delete all messages"
                className=" bg-msg_bg px-3 py-2 text-sm shadow-md hover:shadow-xl hover:bg-red_accent rounded-md hover:bg-input_focus duration-100 focus:filter focus:brightness-75 whitespace-nowrap"
                onClick={() => {
                  deleteAllMessages();
                  setHiddenNav(!hiddenNav);
                }}
              >
                Delete all
              </button>
            </motion.div>
            <motion.div
              animate={{
                translateY: [35, 55],
                translateX: [-35, -35],
                opacity: [0, 1],
                transition: { duration: 0.2 },
              }}
              className="absolute left-0 top-full transform -translate-x-1/2 translate-y-4 bg-accent rounded-md w-min"
            >
              <button
                title="sign out"
                aria-label="sign out"
                className=" bg-msg_bg px-3 py-2 text-sm shadow-md hover:shadow-xl hover:bg-red_accent rounded-md hover:bg-input_focus duration-100 focus:filter focus:brightness-75 whitespace-nowrap"
                onClick={() => {
                  setHiddenNav(!hiddenNav);
                  signOut();
                }}
              >
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </div>
      <LoadingBar
        className="loading_bar"
        color="#39b2e7"
        shadow={false}
        progress={loadingProgress}
        onLoaderFinished={() => setLoadingProgress(0)}
      />
    </header>
  );
};

export default ChatHeader;
