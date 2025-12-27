import { useState, useEffect, useRef } from 'react'

const SIZE = 4 // 4x4x4x4 grid

const Snake4DSection = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2, z: 2, w: 2 }]) // Start in center
  const [food, setFood] = useState(null)
  const [direction, setDirection] = useState({ dx: 1, dy: 0, dz: 0, dw: 0 }) // Moving right initially
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const gameLoopRef = useRef(null)

  // Initialize food on mount
  useEffect(() => {
    generateFood()
  }, [])

  // Generate random food position that doesn't overlap with snake
  const generateFood = () => {
    let newFood
    let isValid = false

    while (!isValid) {
      newFood = {
        x: Math.floor(Math.random() * SIZE),
        y: Math.floor(Math.random() * SIZE),
        z: Math.floor(Math.random() * SIZE),
        w: Math.floor(Math.random() * SIZE)
      }

      // Check if food position overlaps with snake
      isValid = !snake.some(segment =>
        segment.x === newFood.x &&
        segment.y === newFood.y &&
        segment.z === newFood.z &&
        segment.w === newFood.w
      )
    }

    setFood(newFood)
  }

  // Game loop - move snake every 200ms
  useEffect(() => {
    if (isPaused || gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    gameLoopRef.current = setInterval(() => {
      moveSnake()
    }, 400)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPaused, gameOver, snake, direction, food])

  // Move snake in current direction
  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = prevSnake[0]
      const newHead = {
        x: (head.x + direction.dx + SIZE) % SIZE,
        y: (head.y + direction.dy + SIZE) % SIZE,
        z: (head.z + direction.dz + SIZE) % SIZE,
        w: (head.w + direction.dw + SIZE) % SIZE
      }

      // Check self collision
      const hitSelf = prevSnake.some(segment =>
        segment.x === newHead.x &&
        segment.y === newHead.y &&
        segment.z === newHead.z &&
        segment.w === newHead.w
      )

      if (hitSelf) {
        setGameOver(true)
        return prevSnake
      }

      // Check food collision
      const ateFood = food &&
        newHead.x === food.x &&
        newHead.y === food.y &&
        newHead.z === food.z &&
        newHead.w === food.w

      let newSnake
      if (ateFood) {
        // Grow snake (don't remove tail)
        newSnake = [newHead, ...prevSnake]
        setScore(prev => prev + 1)
        generateFood()
      } else {
        // Move snake (remove tail)
        newSnake = [newHead, ...prevSnake.slice(0, -1)]
      }

      return newSnake
    })
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase()

      // Prevent opposite direction (can't go backwards into yourself)
      const canChangeDirection = (newDir) => {
        return !(
          newDir.dx === -direction.dx && newDir.dy === -direction.dy &&
          newDir.dz === -direction.dz && newDir.dw === -direction.dw
        )
      }

      let newDirection = null

      switch (key) {
        // X-Y plane (WASD)
        case 'w': // Up
          newDirection = { dx: 0, dy: -1, dz: 0, dw: 0 }
          break
        case 's': // Down
          newDirection = { dx: 0, dy: 1, dz: 0, dw: 0 }
          break
        case 'a': // Left
          newDirection = { dx: -1, dy: 0, dz: 0, dw: 0 }
          break
        case 'd': // Right
          newDirection = { dx: 1, dy: 0, dz: 0, dw: 0 }
          break

        // Z-W plane (IJKL)
        case 'i': // Ana (W-)
          newDirection = { dx: 0, dy: 0, dz: 0, dw: -1 }
          break
        case 'k': // Kata (W+)
          newDirection = { dx: 0, dy: 0, dz: 0, dw: 1 }
          break
        case 'j': // Forward (Z-)
          newDirection = { dx: 0, dy: 0, dz: -1, dw: 0 }
          break
        case 'l': // Backward (Z+)
          newDirection = { dx: 0, dy: 0, dz: 1, dw: 0 }
          break

        // Space to pause/unpause
        case ' ':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
      }

      if (newDirection && canChangeDirection(newDirection)) {
        setDirection(newDirection)
        // Auto-unpause when changing direction
        if (isPaused && !gameOver) {
          setIsPaused(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPaused, gameOver])

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 3, y: 3, z: 3, w: 3 }])
    setDirection({ dx: 1, dy: 0, dz: 0, dw: 0 })
    setGameOver(false)
    setScore(0)
    setIsPaused(true)
    generateFood()
  }

  // Check if cell contains snake or food
  const getCellContent = (x, y, z, w) => {
    // Check if head
    if (snake[0].x === x && snake[0].y === y && snake[0].z === z && snake[0].w === w) {
      return 'head'
    }

    // Check if body
    const bodyIndex = snake.findIndex((segment, i) =>
      i > 0 && segment.x === x && segment.y === y && segment.z === z && segment.w === w
    )
    if (bodyIndex !== -1) {
      return 'body'
    }

    // Check if food
    if (food && food.x === x && food.y === y && food.z === z && food.w === w) {
      return 'food'
    }

    return null
  }

  // Generate color based on XY coordinates
  // Y determines base color (0-3), X determines lightness (0-3, dark to light)
  const getColorFromXY = (x, y) => {
    const baseColors = [
      { h: 120, s: 60 }, // Y=0: green
      { h: 220, s: 70 }, // Y=1: blue
      { h: 270, s: 60 }, // Y=2: purple
      { h: 0, s: 70 }    // Y=3: red
    ]

    const color = baseColors[y]
    // X determines lightness: 0 is dark (30%), 3 is light (60%)
    const lightness = 30 + (x * 10) // Range from 30% to 60%

    return `hsl(${color.h}, ${color.s}%, ${lightness}%)`
  }

  return (
    <section id="snake" className="snake4d-section">
      <div className="container">
        <h2>4D Snake</h2>

        <div className="game-info">
          <div className="score">Score: {score}</div>
          <div className="status">
            {gameOver ? '💀 Game Over!' : isPaused ? '⏸️ Paused (Press any direction key)' : '🎮 Playing'}
          </div>
        </div>

        <div className="controls-info">
          <div className="control-group">
            <strong>WASD:</strong> Left/Right/Up/Down (X-Y)
          </div>
          <div className="control-group">
            <strong>IJKL:</strong> Forward/Back/Ana/Kata (Z-W)
          </div>
          <div className="control-group">
            <strong>Space:</strong> Pause/Resume
          </div>
        </div>

        {/* 4x4 grid of 4x4 grids (W and Z on outer grid, Y and X on inner grids) */}
        <div className="grid-of-grids snake-grid">
          {Array.from({ length: SIZE }, (_, w) =>
            Array.from({ length: SIZE }, (_, z) => {
              const isActiveGrid = snake.length > 0 && snake[0].w === w && snake[0].z === z
              return (
              <div key={`${w}-${z}`} className={`snake-subgrid ${isActiveGrid ? 'active' : ''} ${isActiveGrid && gameOver ? 'dead' : ''}`}>
                <div className="snake-grid-inner">
                  {Array.from({ length: SIZE }, (_, y) =>
                    Array.from({ length: SIZE }, (_, x) => {
                      const content = getCellContent(x, y, z, w)
                      const isSnake = content === 'head' || content === 'body'
                      const cellStyle = isSnake && !gameOver ? { backgroundColor: getColorFromXY(x, y) } : {}
                      return (
                        <div
                          key={`${w}-${z}-${y}-${x}`}
                          className={`snake-cell ${content || ''} ${gameOver && isSnake ? 'dead' : ''}`}
                          style={cellStyle}
                        >
                          {content === 'head' && '●'}
                          {content === 'body' && '○'}
                          {content === 'food' && '🍎'}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              )
            })
          )}
        </div>

        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </section>
  )
}

export default Snake4DSection
