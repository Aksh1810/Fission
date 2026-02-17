'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Stagger children animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatVariant = {
  animate: {
    y: [0, -6, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Floating decorative atoms */}
      <motion.div
        className="absolute top-20 left-[15%] w-3 h-3 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle at 30% 30%, white, var(--blue))' }}
        variants={floatVariant}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-[20%] w-2 h-2 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle at 30% 30%, white, var(--red))' }}
        variants={floatVariant}
        animate="animate"
        transition={{ delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-32 left-[25%] w-2.5 h-2.5 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle at 30% 30%, white, var(--purple))' }}
        variants={floatVariant}
        animate="animate"
        transition={{ delay: 3 }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center w-full max-w-lg relative z-10"
      >
        {/* Hero */}
        <motion.div variants={item} className="text-center mb-10">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4">
            <span
              className="gradient-text shimmer-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--blue), var(--purple), var(--red), var(--purple), var(--blue))',
                backgroundSize: '200% auto',
              }}
            >
              Fission
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            A strategic chain reaction game. Capture the board
            <br className="hidden sm:block" /> and eliminate your opponent.
          </p>
        </motion.div>

        {/* Game Mode Buttons */}
        <motion.div variants={item} className="flex flex-col gap-4 w-full mb-10">
          <Link href="/singleplayer" className="block group">
            <motion.div
              className="glass-strong rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.02, borderColor: 'rgba(96,165,250,0.25)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Blue glow accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(96,165,250,0.08), transparent 60%)' }} />

              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.05))' }}>
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="font-semibold text-white text-base">Play vs AI</div>
                <div className="text-sm text-slate-400">Challenge the computer</div>
              </div>
              <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </motion.div>
          </Link>

          <Link href="/twoplayer" className="block group">
            <motion.div
              className="glass-strong rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.02, borderColor: 'rgba(168,85,247,0.25)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Purple glow accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(168,85,247,0.08), transparent 60%)' }} />

              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))' }}>
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="font-semibold text-white text-base">Two Players</div>
                <div className="text-sm text-slate-400">Play with a friend locally</div>
              </div>
              <svg className="w-5 h-5 text-slate-500 ml-auto group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>

        {/* How to Play */}
        <motion.div variants={item} className="w-full">
          <div className="glass rounded-2xl px-6 py-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 text-center">How to Play</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Tap any cell to place an atom', color: 'var(--blue)' },
                { step: '2', text: 'Cells explode at 4 atoms, spreading to neighbors', color: 'var(--purple)' },
                { step: '3', text: 'Captured cells convert to your color', color: 'var(--red)' },
                { step: '4', text: 'Eliminate all opponent atoms to win', color: 'var(--green)' },
              ].map(({ step, text, color }) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, transparent)`, opacity: 0.8 }}
                  >
                    {step}
                  </div>
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p variants={item} className="text-xs text-slate-600 mt-8">
          Strategic Chain Reaction Game
        </motion.p>
      </motion.div>
    </main>
  );
}
