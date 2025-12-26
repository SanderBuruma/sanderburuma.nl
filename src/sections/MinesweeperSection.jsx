import { useState, useEffect, useRef } from 'react'

const Minesweeper4D = () => {
  const [board, setBoard] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [hoveredCell, setHoveredCell] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const [dragCurrent, setDragCurrent] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const justDraggedRef = useRef(false)

  const SIZE = 4
  const MINES = 20

  useEffect(() => {
    setBoard(createBoard())
  }, [])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setDragStart(null)
        setDragCurrent(null)
        setIsDragging(false)
      }
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  const createBoard = () => {
    let newBoard = Array(SIZE).fill(0).map(() =>
      Array(SIZE).fill(0).map(() =>
        Array(SIZE).fill(0).map(() =>
          Array(SIZE).fill(0).map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0
          }))
        )
      )
    )

    let minesPlaced = 0
    while (minesPlaced < MINES) {
      const x = Math.floor(Math.random() * SIZE)
      const y = Math.floor(Math.random() * SIZE)
      const z = Math.floor(Math.random() * SIZE)
      const w = Math.floor(Math.random() * SIZE)

      if (!newBoard[w][z][y][x].isMine) {
        newBoard[w][z][y][x].isMine = true
        minesPlaced++
      }
    }

    for (let w = 0; w < SIZE; w++) {
      for (let z = 0; z < SIZE; z++) {
        for (let y = 0; y < SIZE; y++) {
          for (let x = 0; x < SIZE; x++) {
            if (!newBoard[w][z][y][x].isMine) {
              newBoard[w][z][y][x].adjacentMines = countAdjacentMines(newBoard, x, y, z, w)
            }
          }
        }
      }
    }
    return newBoard
  }

  const countAdjacentMines = (board, x, y, z, w) => {
    let count = 0
    for (let dw = -1; dw <= 1; dw++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dw === 0 && dz === 0 && dy === 0 && dx === 0) continue

            const nw = w + dw
            const nz = z + dz
            const ny = y + dy
            const nx = x + dx

            if (nw >= 0 && nw < SIZE && nz >= 0 && nz < SIZE && ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
              if (board[nw][nz][ny][nx].isMine) {
                count++
              }
            }
          }
        }
      }
    }
    return count
  }

  const isAdjacent = (x1, y1, z1, w1, x2, y2, z2, w2) => {
    if (x1 === x2 && y1 === y2 && z1 === z2 && w1 === w2) return false
    const dx = Math.abs(x1 - x2)
    const dy = Math.abs(y1 - y2)
    const dz = Math.abs(z1 - z2)
    const dw = Math.abs(w1 - w2)
    return dx <= 1 && dy <= 1 && dz <= 1 && dw <= 1
  }

  const countAdjacentFlags = (board, x, y, z, w) => {
    let count = 0
    for (let dw = -1; dw <= 1; dw++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dw === 0 && dz === 0 && dy === 0 && dx === 0) continue

            const nw = w + dw
            const nz = z + dz
            const ny = y + dy
            const nx = x + dx

            if (nw >= 0 && nw < SIZE && nz >= 0 && nz < SIZE && ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
              if (board[nw][nz][ny][nx].isFlagged) {
                count++
              }
            }
          }
        }
      }
    }
    return count
  }

  const countUnrevealedUnflagged = (board, x, y, z, w) => {
    let count = 0
    for (let dw = -1; dw <= 1; dw++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dw === 0 && dz === 0 && dy === 0 && dx === 0) continue

            const nw = w + dw
            const nz = z + dz
            const ny = y + dy
            const nx = x + dx

            if (nw >= 0 && nw < SIZE && nz >= 0 && nz < SIZE && ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
              const adjacentCell = board[nw][nz][ny][nx]
              if (!adjacentCell.isRevealed && !adjacentCell.isFlagged) {
                count++
              }
            }
          }
        }
      }
    }
    return count
  }

  const handleMouseDown = (x, y, z, w) => {
    if (gameOver) return
    setDragStart({ x, y, z, w })
    setDragCurrent({ x, y, z, w })
    setIsDragging(true)
  }

  const handleMouseUp = (x, y, z, w) => {
    if (!isDragging || !dragStart || gameOver) {
      setDragStart(null)
      setDragCurrent(null)
      setIsDragging(false)
      return
    }

    const isDifferentCell = dragStart.x !== x || dragStart.y !== y || dragStart.z !== z || dragStart.w !== w

    if (isDifferentCell) {
      justDraggedRef.current = true
      setTimeout(() => {
        justDraggedRef.current = false
      }, 100)

      const newBoard = board.map(arrW => arrW.map(arrZ => arrZ.map(arrY => arrY.map(cell => ({ ...cell })))))

      const minX = Math.min(dragStart.x, x)
      const maxX = Math.max(dragStart.x, x)
      const minY = Math.min(dragStart.y, y)
      const maxY = Math.max(dragStart.y, y)
      const minZ = Math.min(dragStart.z, z)
      const maxZ = Math.max(dragStart.z, z)
      const minW = Math.min(dragStart.w, w)
      const maxW = Math.max(dragStart.w, w)

      let hitMine = false
      for (let tw = minW; tw <= maxW; tw++) {
        for (let tz = minZ; tz <= maxZ; tz++) {
          for (let ty = minY; ty <= maxY; ty++) {
            for (let tx = minX; tx <= maxX; tx++) {
              const cell = newBoard[tw][tz][ty][tx]
              if (!cell.isFlagged && !cell.isRevealed) {
                revealCell(newBoard, tx, ty, tz, tw)
                if (cell.isMine) {
                  hitMine = true
                }
              }
            }
          }
        }
      }

      if (hitMine) {
        setGameOver(true)
        revealAllMines(newBoard)
      } else if (checkWinCondition(newBoard)) {
        setWin(true)
        setGameOver(true)
        revealAllMines(newBoard)
      }

      setBoard(newBoard)
    }

    setDragStart(null)
    setDragCurrent(null)
    setIsDragging(false)
  }

  const renderBoard = () => {
    if (!board.length) return null

    return (
      <div className="grid-of-grids">
        {Array.from({ length: SIZE }, (_, w) =>
          Array.from({ length: SIZE }, (_, z) => (
            <div key={`${w}-${z}`} className="minesweeper-grid">
              {board[w][z].map((row, y) =>
                row.map((cell, x) => {
                  const isAdjacentToHovered = hoveredCell &&
                    !cell.isRevealed &&
                    !cell.isFlagged &&
                    isAdjacent(x, y, z, w, hoveredCell.x, hoveredCell.y, hoveredCell.z, hoveredCell.w)

                  const isInDragSelection = isDragging && dragStart && dragCurrent &&
                    !cell.isFlagged &&
                    !cell.isRevealed &&
                    x >= Math.min(dragStart.x, dragCurrent.x) &&
                    x <= Math.max(dragStart.x, dragCurrent.x) &&
                    y >= Math.min(dragStart.y, dragCurrent.y) &&
                    y <= Math.max(dragStart.y, dragCurrent.y) &&
                    z >= Math.min(dragStart.z, dragCurrent.z) &&
                    z <= Math.max(dragStart.z, dragCurrent.z) &&
                    w >= Math.min(dragStart.w, dragCurrent.w) &&
                    w <= Math.max(dragStart.w, dragCurrent.w)

                  const adjacentFlagCount = countAdjacentFlags(board, x, y, z, w)
                  const adjustedMineCount = cell.adjacentMines - adjacentFlagCount
                  const unrevealedUnflaggedCount = countUnrevealedUnflagged(board, x, y, z, w)

                  let cellContent = ''
                  if (cell.isFlagged) {
                    cellContent = '🚩'
                  } else if (cell.isRevealed && !cell.isMine) {
                    if (unrevealedUnflaggedCount > 0) {
                      cellContent = adjustedMineCount
                    } else if (adjustedMineCount > 0) {
                      cellContent = adjustedMineCount
                    }
                  }

                  return (
                    <div
                      key={`${w}-${z}-${y}-${x}`}
                      className={`cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine && gameOver ? (win ? 'mine-win' : 'mine') : ''} ${cell.isFlagged ? 'flagged' : ''} ${isAdjacentToHovered ? 'adjacent' : ''} ${isInDragSelection ? 'drag-selected' : ''}`}
                      onClick={() => {
                        if (!justDraggedRef.current) {
                          handleCellClick(x, y, z, w)
                        }
                      }}
                      onContextMenu={(e) => handleFlag(e, x, y, z, w)}
                      onMouseDown={() => handleMouseDown(x, y, z, w)}
                      onMouseUp={() => handleMouseUp(x, y, z, w)}
                      onMouseEnter={() => {
                        setHoveredCell({ x, y, z, w })
                        if (isDragging) {
                          setDragCurrent({ x, y, z, w })
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {cellContent}
                    </div>
                  )
                })
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  const autoRevealAdjacent = (board, x, y, z, w) => {
    for (let dw = -1; dw <= 1; dw++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dw === 0 && dz === 0 && dy === 0 && dx === 0) continue

            const nw = w + dw
            const nz = z + dz
            const ny = y + dy
            const nx = x + dx

            if (nw >= 0 && nw < SIZE && nz >= 0 && nz < SIZE && ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
              const adjacentCell = board[nw][nz][ny][nx]

              if (adjacentCell.isRevealed && !adjacentCell.isMine) {
                const flagCount = countAdjacentFlags(board, nx, ny, nz, nw)
                const adjustedCount = adjacentCell.adjacentMines - flagCount

                if (adjustedCount === 0) {
                  for (let dw2 = -1; dw2 <= 1; dw2++) {
                    for (let dz2 = -1; dz2 <= 1; dz2++) {
                      for (let dy2 = -1; dy2 <= 1; dy2++) {
                        for (let dx2 = -1; dx2 <= 1; dx2++) {
                          if (dw2 === 0 && dz2 === 0 && dy2 === 0 && dx2 === 0) continue

                          const nnw = nw + dw2
                          const nnz = nz + dz2
                          const nny = ny + dy2
                          const nnx = nx + dx2

                          if (nnw >= 0 && nnw < SIZE && nnz >= 0 && nnz < SIZE && nny >= 0 && nny < SIZE && nnx >= 0 && nnx < SIZE) {
                            const neighborCell = board[nnw][nnz][nny][nnx]
                            if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
                              revealCell(board, nnx, nny, nnz, nnw)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  const handleFlag = (e, x, y, z, w) => {
    e.preventDefault()
    if (gameOver) return

    const newBoard = board.map(arrW => arrW.map(arrZ => arrZ.map(arrY => arrY.map(cell => ({ ...cell })))))

    if (!newBoard[w][z][y][x].isRevealed) {
      newBoard[w][z][y][x].isFlagged = !newBoard[w][z][y][x].isFlagged

      autoRevealAdjacent(newBoard, x, y, z, w)

      let hitMine = false
      for (let tw = 0; tw < SIZE && !hitMine; tw++) {
        for (let tz = 0; tz < SIZE && !hitMine; tz++) {
          for (let ty = 0; ty < SIZE && !hitMine; ty++) {
            for (let tx = 0; tx < SIZE && !hitMine; tx++) {
              if (newBoard[tw][tz][ty][tx].isMine && newBoard[tw][tz][ty][tx].isRevealed) {
                hitMine = true
                setGameOver(true)
                revealAllMines(newBoard)
              }
            }
          }
        }
      }

      if (!hitMine && checkWinCondition(newBoard)) {
        setWin(true)
        setGameOver(true)
        revealAllMines(newBoard)
      }
    }

    setBoard(newBoard)
  }

  const handleCellClick = (x, y, z, w) => {
    if (gameOver) {
      const newBoard = createBoard()
      setGameOver(false)
      setWin(false)

      if (newBoard[w][z][y][x].isMine) {
        setGameOver(true)
        revealAllMines(newBoard)
      } else {
        revealCell(newBoard, x, y, z, w)
        if (checkWinCondition(newBoard)) {
          setWin(true)
          setGameOver(true)
          revealAllMines(newBoard)
        }
      }
      setBoard(newBoard)
      return
    }

    let newBoard = board.map(arrW => arrW.map(arrZ => arrZ.map(arrY => arrY.map(cell => ({ ...cell })))))

    if (newBoard[w][z][y][x].isMine) {
      setGameOver(true)
      revealAllMines(newBoard)
    } else {
      revealCell(newBoard, x, y, z, w)
      if (checkWinCondition(newBoard)) {
        setWin(true)
        setGameOver(true)
        revealAllMines(newBoard)
      }
    }
    setBoard(newBoard)
  }

  const checkWinCondition = (board) => {
    for (let w = 0; w < SIZE; w++) {
      for (let z = 0; z < SIZE; z++) {
        for (let y = 0; y < SIZE; y++) {
          for (let x = 0; x < SIZE; x++) {
            const cell = board[w][z][y][x]
            if (!cell.isMine && !cell.isRevealed) {
              return false
            }
          }
        }
      }
    }
    return true
  }

  const revealCell = (board, x, y, z, w) => {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE || z < 0 || z >= SIZE || w < 0 || w >= SIZE) return

    const cell = board[w][z][y][x]
    if (cell.isRevealed) return

    cell.isRevealed = true

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dw = -1; dw <= 1; dw++) {
        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dw === 0 && dz === 0 && dy === 0 && dx === 0) continue
              revealCell(board, x + dx, y + dy, z + dz, w + dw)
            }
          }
        }
      }
    }
  }

  const revealAllMines = (board) => {
    for (let w = 0; w < SIZE; w++) {
      for (let z = 0; z < SIZE; z++) {
        for (let y = 0; y < SIZE; y++) {
          for (let x = 0; x < SIZE; x++) {
            if (board[w][z][y][x].isMine) {
              board[w][z][y][x].isRevealed = true
            }
          }
        }
      }
    }
  }

  return (
    <div className="minesweeper-container">
      <h2 className="section-title">4D Minesweeper</h2>
      {renderBoard()}
      {win && <div className="game-over-message">You Win!</div>}
      {gameOver && !win && <div className="game-over-message">Game Over</div>}
      <button
        className="btn btn-primary"
        onClick={() => {
          setGameOver(false)
          setWin(false)
          setBoard(createBoard())
        }}
      >
        Reset
      </button>
    </div>
  )
}

const MinesweeperSection = () => {
  return (
    <section id="minesweeper" className="minesweeper">
      <div className="container">
        <Minesweeper4D />
      </div>
    </section>
  )
}

export default MinesweeperSection
