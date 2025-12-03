'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Codice finale che appare dopo aver completato tutti e 5 i giochi
const FINAL_CODE = 'FCbzg6aERC6r1857T2uBXu9G6PfRYJ'

export default function MinigamesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [participantCode, setParticipantCode] = useState<string | null>(null)
  const [currentGame, setCurrentGame] = useState<number>(1) // Gioco attualmente disponibile
  const [completedGames, setCompletedGames] = useState<number[]>([])
  const [activeGame, setActiveGame] = useState<number | null>(null) // Gioco in esecuzione
  const [showFinalCode, setShowFinalCode] = useState(false)

  // Load participant code
  useEffect(() => {
    const code = localStorage.getItem('participantCode')
    if (!code) {
      router.push('/login')
      return
    }
    setParticipantCode(code)
    loadProgress(code)
  }, [])

  // Load progress from Supabase
  const loadProgress = async (code: string) => {
    const { data, error } = await supabase
      .from('game_participants')
      .select('minigame_progress')
      .eq('participant_code', code)
      .single()

    if (error) {
      // Colonna non esiste ancora - usa default vuoto
      console.warn('Progress column not yet created:', error.message)
      setCompletedGames([])
      setCurrentGame(1)
      return
    }

    if (data?.minigame_progress && Array.isArray(data.minigame_progress)) {
      const progress = data.minigame_progress as number[]
      setCompletedGames(progress)
      setCurrentGame(progress.length + 1)

      if (progress.length >= 5) {
        setShowFinalCode(true)
      }
    }
  }

  // Save progress to Supabase
  const saveProgress = async (gameNumber: number) => {
    if (!participantCode) return

    const newCompleted = [...completedGames, gameNumber]
    setCompletedGames(newCompleted)

    try {
      const { error } = await supabase
        .from('game_participants')
        .update({ minigame_progress: newCompleted })
        .eq('participant_code', participantCode)

      if (error) {
        console.warn('Could not save to DB:', error.message)
        localStorage.setItem(`minigame_progress_${participantCode}`, JSON.stringify(newCompleted))
      }
    } catch (err) {
      console.warn('Error saving:', err)
      localStorage.setItem(`minigame_progress_${participantCode}`, JSON.stringify(newCompleted))
    }

    // Unlock next game
    if (gameNumber < 5) {
      setCurrentGame(gameNumber + 1)
    } else {
      setShowFinalCode(true)
    }

    setActiveGame(null)
  }

  const completeGame = (gameNumber: number) => {
    saveProgress(gameNumber)
  }

  const startGame = (gameNumber: number) => {
    if (gameNumber === currentGame && !completedGames.includes(gameNumber)) {
      setActiveGame(gameNumber)
    }
  }

  // Render game based on activeGame
  const renderGame = () => {
    if (!activeGame) return null

    switch (activeGame) {
      case 1:
        return <MemoryGame onComplete={() => completeGame(1)} onBack={() => setActiveGame(null)} />
      case 2:
        return <PuzzleSlider onComplete={() => completeGame(2)} onBack={() => setActiveGame(null)} />
      case 3:
        return <SequenceGame onComplete={() => completeGame(3)} onBack={() => setActiveGame(null)} />
      case 4:
        return <ClickerChallenge onComplete={() => completeGame(4)} onBack={() => setActiveGame(null)} />
      case 5:
        return <QuizGame onComplete={() => completeGame(5)} onBack={() => setActiveGame(null)} />
      default:
        return null
    }
  }

  if (activeGame) {
    return renderGame()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          ← Torna alla Landing
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center">
          Sfida Febbraio 2026
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Completa i mini-giochi uno alla volta per ottenere il codice finale
        </p>

        {/* Games - Only show current game */}
        <div className="flex flex-col items-center gap-8 mb-12">
          {[1, 2, 3, 4, 5].map(num => {
            const isCompleted = completedGames.includes(num)
            const isAvailable = num === currentGame && !isCompleted
            const isLocked = num > currentGame

            // Only show completed or current game
            if (num < currentGame && !isCompleted) return null

            return (
              <button
                key={num}
                onClick={() => startGame(num)}
                disabled={!isAvailable}
                className={`w-64 h-64 rounded-full border-4 transition flex items-center justify-center text-8xl ${
                  isCompleted
                    ? 'bg-green-900/30 border-green-500'
                    : isAvailable
                    ? 'bg-red-900/30 border-red-500 hover:bg-red-900/50 animate-pulse cursor-pointer'
                    : 'bg-gray-900/30 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                {isCompleted ? '✅' : isLocked ? '🔒' : '🎮'}
              </button>
            )
          })}
        </div>

        {/* Final Code Display */}
        {showFinalCode && (
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-2 border-green-500 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">🎉 Complimenti!</h2>
            <p className="text-xl mb-4">Hai completato tutti i giochi!</p>
            <p className="text-sm text-gray-400 mb-6">Ecco il tuo codice finale:</p>
            <div className="bg-black/50 p-6 rounded-lg font-mono text-2xl mb-6 select-all">
              {FINAL_CODE}
            </div>
            <p className="text-sm text-gray-400">
              Copia questo codice e vai alla Game Area per convalidarlo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== GAME 1: MEMORY GAME ====================
interface MemoryGameProps {
  onComplete: () => void
  onBack: () => void
}

function MemoryGame({ onComplete, onBack }: MemoryGameProps) {
  const symbols = ['🎮', '🎯', '🎲', '🎭', '🎪', '🎨']
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const doubled = [...symbols, ...symbols]
    const shuffled = doubled.sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimeout(() => onComplete(), 1000)
    }
  }, [matched, cards, onComplete])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second])
      }
      setTimeout(() => setFlipped([]), 1000)
    }
  }, [flipped, cards])

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return
    setFlipped(prev => [...prev, index])
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
        ← Indietro
      </button>

      <p className="text-xl mb-8">Tempo: {timeLeft}s | Trovate: {matched.length / 2}/6</p>

      {gameOver ? (
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">Tempo scaduto!</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
            Riprova
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-w-2xl">
          {cards.map((symbol, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index)
            return (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`w-24 h-24 text-4xl rounded-lg transition ${
                  isFlipped ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {isFlipped ? symbol : '❓'}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== GAME 2: PUZZLE SLIDER ====================
function PuzzleSlider({ onComplete, onBack }: MemoryGameProps) {
  const size = 4
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const initial = Array.from({ length: size * size }, (_, i) => i)
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = initial.indexOf(0)
      const validMoves = getValidMoves(emptyIndex)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      ;[initial[emptyIndex], initial[randomMove]] = [initial[randomMove], initial[emptyIndex]]
    }
    setTiles(initial)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    if (tiles.length > 0 && isSolved()) {
      setTimeout(() => onComplete(), 1000)
    }
  }, [tiles, onComplete])

  const getValidMoves = (emptyIndex: number) => {
    const row = Math.floor(emptyIndex / size)
    const col = emptyIndex % size
    const moves = []
    if (row > 0) moves.push(emptyIndex - size)
    if (row < size - 1) moves.push(emptyIndex + size)
    if (col > 0) moves.push(emptyIndex - 1)
    if (col < size - 1) moves.push(emptyIndex + 1)
    return moves
  }

  const handleClick = (index: number) => {
    const emptyIndex = tiles.indexOf(0)
    const validMoves = getValidMoves(emptyIndex)
    if (validMoves.includes(index)) {
      const newTiles = [...tiles]
      ;[newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]]
      setTiles(newTiles)
      setMoves(m => m + 1)
    }
  }

  const isSolved = () => {
    return tiles.every((tile, index) => tile === index)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
        ← Indietro
      </button>

      <p className="text-xl mb-8">Tempo: {timeLeft}s | Mosse: {moves}</p>

      {gameOver ? (
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">Tempo scaduto!</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
            Riprova
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-w-md">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-20 h-20 text-2xl font-bold rounded-lg transition ${
                tile === 0 ? 'bg-black' : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
              }`}
            >
              {tile === 0 ? '' : tile}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== GAME 3: SEQUENCE GAME ====================
function SequenceGame({ onComplete, onBack }: MemoryGameProps) {
  const colors = ['🔴', '🟢', '🔵', '🟡']
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [level, setLevel] = useState(1)
  const [showing, setShowing] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (level <= 6) {
      startLevel()
    } else {
      setTimeout(() => onComplete(), 1000)
    }
  }, [level])

  const startLevel = () => {
    const newSequence = [...sequence, Math.floor(Math.random() * 4)]
    setSequence(newSequence)
    setUserSequence([])
    showSequence(newSequence)
  }

  const showSequence = async (seq: number[]) => {
    setShowing(true)
    for (const color of seq) {
      await new Promise(resolve => setTimeout(resolve, 600))
      const button = document.getElementById(`color-${color}`)
      if (button) {
        button.classList.add('scale-125', 'brightness-150')
        setTimeout(() => {
          button.classList.remove('scale-125', 'brightness-150')
        }, 300)
      }
    }
    setShowing(false)
  }

  const handleClick = (index: number) => {
    if (showing) return

    const newUserSeq = [...userSequence, index]
    setUserSequence(newUserSeq)

    if (sequence[newUserSeq.length - 1] !== index) {
      setGameOver(true)
      return
    }

    if (newUserSeq.length === sequence.length) {
      setTimeout(() => setLevel(l => l + 1), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
        ← Indietro
      </button>

      <p className="text-xl mb-8">Livello: {level}/6 {showing && '(Guarda!)'}</p>

      {gameOver ? (
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">Sequenza sbagliata!</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
            Riprova
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 max-w-md">
          {colors.map((color, index) => (
            <button
              key={index}
              id={`color-${index}`}
              onClick={() => handleClick(index)}
              disabled={showing}
              className="w-32 h-32 text-6xl rounded-lg transition disabled:opacity-50"
            >
              {color}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== GAME 4: CLICKER CHALLENGE ====================
function ClickerChallenge({ onComplete, onBack }: MemoryGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [targets, setTargets] = useState<{ x: number; y: number; radius: number }[]>([])
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    spawnTargets(5)

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        spawnTargets(1)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    if (clicks >= 50) {
      setTimeout(() => onComplete(), 1000)
    }
  }, [clicks, onComplete])

  useEffect(() => {
    drawCanvas()
  }, [targets])

  const spawnTargets = (count: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const newTargets = []
    for (let i = 0; i < count; i++) {
      newTargets.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        radius: 20 + Math.random() * 10,
      })
    }
    setTargets(prev => [...prev, ...newTargets].slice(-15))
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    targets.forEach(target => {
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedIndex = targets.findIndex(target => {
      const distance = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2)
      return distance <= target.radius
    })

    if (clickedIndex !== -1) {
      setTargets(prev => prev.filter((_, i) => i !== clickedIndex))
      setClicks(c => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
        ← Indietro
      </button>

      <p className="text-xl mb-8">Tempo: {timeLeft}s | Click: {clicks}/50</p>

      {gameOver && clicks < 50 ? (
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">Tempo scaduto! Hai fatto {clicks}/50 click</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
            Riprova
          </button>
        </div>
      ) : clicks >= 50 ? (
        <div className="text-2xl text-green-500">Completato! 🎉</div>
      ) : (
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          className="border-2 border-white rounded-lg cursor-crosshair"
        />
      )}
    </div>
  )
}

// ==================== GAME 5: QUIZ A TEMPO ====================
function QuizGame({ onComplete, onBack }: MemoryGameProps) {
  const questions = [
    {
      question: 'Domanda 1 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 0,
    },
    {
      question: 'Domanda 2 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 1,
    },
    {
      question: 'Domanda 3 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 2,
    },
    {
      question: 'Domanda 4 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 3,
    },
    {
      question: 'Domanda 5 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 0,
    },
    {
      question: 'Domanda 6 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 1,
    },
    {
      question: 'Domanda 7 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 2,
    },
    {
      question: 'Domanda 8 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 3,
    },
    {
      question: 'Domanda 9 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 0,
    },
    {
      question: 'Domanda 10 da personalizzare',
      answers: ['Risposta A', 'Risposta B', 'Risposta C', 'Risposta D'],
      correct: 1,
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameOver, setGameOver] = useState(false)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (timeLeft === 0 && !answered) {
      handleAnswer(-1)
      return
    }
    if (!answered) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, answered])

  const handleAnswer = (answerIndex: number) => {
    if (answered) return
    setAnswered(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(s => s + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1)
        setTimeLeft(10)
        setAnswered(false)
      } else {
        setGameOver(true)
      }
    }, 1500)
  }

  useEffect(() => {
    if (gameOver && score >= 8) {
      setTimeout(() => onComplete(), 2000)
    }
  }, [gameOver, score, onComplete])

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
        ← Indietro
      </button>

      {gameOver ? (
        <div className="text-center">
          <p className="text-3xl mb-4">Punteggio: {score}/10</p>
          {score >= 8 ? (
            <p className="text-2xl text-green-500">Complimenti! 🎉</p>
          ) : (
            <>
              <p className="text-2xl text-red-500 mb-4">Serve almeno 8/10</p>
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">
                Riprova
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-2xl w-full">
          <div className="mb-6">
            <p className="text-xl mb-2">Domanda {currentQuestion + 1}/10</p>
            <p className="text-4xl font-bold mb-4">⏱️ {timeLeft}s</p>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">{questions[currentQuestion].question}</h3>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`p-4 rounded-lg text-left transition ${
                  answered && index === questions[currentQuestion].correct
                    ? 'bg-green-600'
                    : answered && index !== questions[currentQuestion].correct
                    ? 'bg-red-900/30'
                    : 'bg-white/10 hover:bg-white/20'
                } ${answered ? 'cursor-not-allowed' : ''}`}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
