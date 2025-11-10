'use client'

export default function PasswordSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
              <span className="text-6xl">✓</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Hai indovinato!
          </h1>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-white/90">
              Tutti i partecipanti guadagnano
            </p>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
              <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                100 punti
              </span>
            </div>
          </div>

          {/* Celebration */}
          <div className="text-6xl animate-pulse">
            🎉 🎊 🎈
          </div>
        </div>
      </div>
    </div>
  )
}
