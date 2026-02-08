import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
            Fission
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md mx-auto">
          A strategic chain reaction game. Capture the board and eliminate your opponent!
        </p>
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/singleplayer">
          <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 
                           hover:from-blue-500 hover:to-blue-600 
                           text-white font-semibold text-lg rounded-xl
                           transition-all duration-200 transform hover:scale-105
                           shadow-lg shadow-blue-500/25">
            Play vs AI
          </button>
        </Link>

        <Link href="/twoplayer">
          <button className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 
                           hover:from-purple-500 hover:to-purple-600 
                           text-white font-semibold text-lg rounded-xl
                           transition-all duration-200 transform hover:scale-105
                           shadow-lg shadow-purple-500/25">
          Two Players
          </button>
        </Link>
      </div>

      {/* Rules Section */}
      <div className="mt-16 max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">How to Play</h2>
        <div className="text-gray-400 space-y-2 text-left">
          <p>• <span className="text-blue-400">Blue</span> plays first, then turns alternate</p>
          <p>• Tap your cells to add atoms (shown as dots)</p>
          <p>• When a cell reaches <span className="text-yellow-400">4 atoms</span>, it explodes!</p>
          <p>• Explosions spread to neighbors and convert them to your color</p>
          <p>• <span className="text-green-400">Win</span> by eliminating all opponent cells</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        Built with Next.js • Production-grade architecture
      </footer>
    </main>
  );
}
