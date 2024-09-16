import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaGreaterThan } from "react-icons/fa";
const SignedOut = () => {
  return (

      <div className="bg-black pt-5 flex justify-center flex-col h-screen w-full">
        <div className="w-[80%] m-auto">
          <div className="flex justify-between items-center">
            <div className="flex">
              <Image
                src="/images/logo.png"
                alt="logo"
                height={0}
                width={0}
                className="h-10 w-auto"
                unoptimized
                quality={100}
              />
              <h2 className="text-lg text-white pl-4 align-middle content-center">
                Square Clock
              </h2>
            </div>

            <Link
              href="/login"
              className="bg-[#E50914] px-[2rem] py-[0.5rem] rounded-md text-white text-[0.9rem] text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="px-4 py-4 w-[80%] m-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">
            Welcome to Square Clock – Shaping Efficiency, Building Dreams
          </h1>

          <p className="text-xl text-white mb-4">
            At Square, every minute you spend contributes to designing spaces
            that inspire. Time is one of our most valuable resources, and
            logging it helps us understand where we excel and where we can
            improve.
          </p>

          <section className="text-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-semibold mb-2">
              Why Time Logging Matters:
            </h2>
            <ol className="list-decimal space-y-4">
              <li className="mb-1">
                <p className="font-medium">Optimize Your Workflow</p>
                <p>
                  By tracking your time, you can see how your efforts translate
                  into progress, giving you insight into managing your day more
                  effectively.
                </p>
              </li>
              <li className="mb-1">
                <p className="font-medium">Enhance Creativity</p>
                <p>
                  Less time worrying about deadlines means more time to focus on
                  what you do best—creating stunning architectural designs.
                </p>
              </li>
              <li className="mb-1">
                <p className="font-medium">Empower Collaboration</p>
                <p>
                  Time logs enable seamless collaboration, ensuring every team
                  member's contributions align toward shared goals.
                </p>
              </li>
              <li className="mb-1">
                <p className="font-medium">Build Your Legacy</p>
                <p>
                  With clear visibility of your work, you're not just logging
                  hours, you're building a portfolio of achievement.
                </p>
              </li>
            </ol>
          </section>
      </div>
      </div>
  );
};

export default SignedOut;
