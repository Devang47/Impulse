import firebaseApp from "../utils/firebase";
import { useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import Router from "next/router";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

import Head from "next/head";

const auth = getAuth(firebaseApp);

export function SignIn() {
  const [user, loading, error] = useAuthState(auth);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    const result = await getRedirectResult(auth);

    console.log({ result });
    if (result) {
      // This is the signed-in user
      const user = result.user;
      console.log({ user });
    }
  };

  const signInAnime = useAnimation();

  useEffect(() => {
    if (user) {
      const animate = async () => {
        await signInAnime.start({
          height: "100%",
          transition: { duration: 0.5, easings: [0.11, 0, 0.5, 0] },
        });
        Router.push("/app");
      };
      animate();
    }
    error && Router.push("/signin");
  }, [user, error]);

  return (
    <>
      <Head>
        <title>Impulse | Sign in</title>
      </Head>
      <section className="flex w-full h-full items-center justify-center flex-col signin_bg overflow-hidden ">
        <motion.div
          animate={signInAnime}
          className="bg-white fixed top-0 left-0 w-full h-0"
        ></motion.div>

        <h1 className=" text-6xl text-white font-semibold block  mt-6">
          Impulse
        </h1>
        <h2 className="text-lg text-time font-medium mt-4 text-center w-10/12 max-w-lg">
          Let's deliver that message to your phone with the best security
          systems in the town.
        </h2>

        <div className="apply_shadow rounded py-6 px-10 w-min mt-8 ">
          <motion.button
            title="Sign in"
            aria-label="Sign in"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.1 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1, damping: 0.05 },
            }}
            className=" text-lg py-2 px-6 border border-white rounded-md shadow-md hover:shadow-2xl duration-75 text-accent  mx-auto whitespace-nowrap font-bold 
            uppercase bg-white hover:bg-gray-100"
            style={{ color: "#1D3557" }}
            onClick={signInWithGoogle}
          >
            {loading ? <>loading...</> : <> Sign in </>}
          </motion.button>
        </div>
      </section>
    </>
  );
}

export default SignIn;
