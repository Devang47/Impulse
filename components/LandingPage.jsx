import Link from "next/link";

function LandingPage() {
  return (
    <>
      <section className="landing_section flex flex-col relative w-full h-full overflow-hidden items-center justify-center md:px-10 lg:px-20">
        <section className="left w-full py-24 px-6 text-center">
          <div className="mx-auto md:max-w-xl lg:max-w-2xl">
            <h1 className="font-extrabold text-4xl w-11/12 lg:text-5xl mx-auto">
              Let’s send messages in a more
              <span className="landing_blue"> Encrypted </span> and{" "}
              <span className="landing_red"> Secure </span> way
            </h1>
            <h2 className="mt-4 w-10/12 lg:text-lg md:max-w-md mx-auto md:mt-5">
              <b>Impulse</b> helps you to send messages to yourself across
              multiple devices in a more Encrypted and Secure way using{" "}
              <b>10x Utf8 encryption</b>.
            </h2>

            <div className=" flex gap-4 mt-12 ">
              <Link href="/signin">
                <a className="mx-auto">
                  <button className="py-2 px-6  duration-75 bg-blue text-white font-bold rounded-md shadow-lg border-2  border-white uppercase tracking-wide text-lg hover:shadow-md">
                    Sign in
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </section>
        <div className="border_custom bg-blue-light absolute"></div>
        <div className="border_custom bg-red-light absolute"></div>
      </section>
    </>
  );
}

export default LandingPage;
