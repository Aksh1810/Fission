import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 pattern-bg">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">
            Fission
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          A strategic chain reaction game. Capture the board and eliminate your opponent!
        </p>
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col gap-5 w-full max-w-sm">
        <Link href="/singleplayer">
          <button className="w-full py-5 px-8 glass
                           text-white font-semibold text-lg rounded-2xl
                           transition-all duration-300 transform hover:scale-[1.03]
                           hover:bg-blue-600/20 hover:border-blue-500/40
                           shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30
                           flex items-center justify-center gap-3 group">
            <svg className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Play vs AI</span>
          </button>
        </Link>

        <Link href="/twoplayer">
          <button className="w-full py-5 px-8 glass
                           text-white font-semibold text-lg rounded-2xl
                           transition-all duration-300 transform hover:scale-[1.03]
                           hover:bg-purple-600/20 hover:border-purple-500/40
                           shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30
                           flex items-center justify-center gap-3 group">
            <svg className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Two Players</span>
          </button>
        </Link>
      </div>

      {/* Rules Section */}
      <div className="mt-16 max-w-lg glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-5 text-center gradient-text">How to Play</h2>
        <div className="text-gray-300 space-y-3 text-left">
          <p className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">•</span>
            <span><span className="text-blue-400 font-medium">Blue</span> plays first, then turns alternate</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-purple-400 text-lg">•</span>
            <span>Tap your cells to add atoms (shown as dots)</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-yellow-400 text-lg">•</span>
            <span>When a cell reaches <span className="text-yellow-400 font-medium">4 atoms</span>, it explodes!</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-orange-400 text-lg">•</span>
            <span>Explosions spread to neighbors and convert them to your color</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-green-400 text-lg">•</span>
            <span><span className="text-green-400 font-medium">Win</span> by eliminating all opponent cells</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        Built with Next.js • Strategic Chain Reaction Game
      </footer>
    </main>
  );
}
