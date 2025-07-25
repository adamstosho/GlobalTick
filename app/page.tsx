"use client"
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background video or SVG */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        poster="/placeholder.jpg"
      >
        <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
      </video>
      {/* Overlay for color tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-cyan-100/40 to-green-100/60 dark:from-gray-900/80 dark:via-blue-950/60 dark:to-gray-800/80 z-10" />
      {/* Content */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="rounded-full shadow-2xl bg-white/80 dark:bg-gray-900/80 p-4"
          >
            <Image src="/placeholder-logo.svg" alt="GlobeTick Logo" width={120} height={120} className="drop-shadow-xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 bg-clip-text text-transparent text-center drop-shadow-lg"
          >
            Welcome to GlobeTick
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl text-center"
          >
            The most beautiful, modern, and powerful world time and meeting planner. Effortlessly sync, plan, and connect across timezones with stunning visuals and smooth animations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={() => router.push("/app-page")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 text-white text-2xl font-bold shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </main>
      {/* Decorative SVG animation at the bottom */}
      <motion.svg
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, duration: 1, type: "spring" }}
        className="absolute bottom-0 left-0 w-full z-10"
        height="120"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
