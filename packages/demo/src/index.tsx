import React, { FC, MouseEvent, useCallback, useLayoutEffect, useState } from 'react'
import { render } from 'react-dom'
import './index.scss'
import { fitCurve } from '@odiak/fit-curve'

interface Point {
  readonly x: number
  readonly y: number
}

interface Path {
  originalPoints: readonly Point[]
  smoothedPoints?: {
    tolerance: number
    points: readonly Point[]
  } | null
}

type Paths = readonly Path[]

const App: FC<{}> = () => {
  const [paths, setPaths] = useState<Paths>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const onMouseDown = useCallback((e: MouseEvent) => {
    setIsDrawing(true)
    const p = mouseEventToPoint(e)
    setPaths((paths) => [...paths, { originalPoints: [p] }])
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing) return

      const p = mouseEventToPoint(e)
      setPaths((paths) => {
        const lastPath = paths[paths.length - 1]
        const restPaths = paths.slice(0, -1)
        return [
          ...restPaths,
          {
            ...lastPath,
            originalPoints: [...lastPath.originalPoints, p]
          }
        ]
      })
    },
    [isDrawing]
  )

  const onMouseUpGlobal = useCallback(() => {
    setIsDrawing(false)
    setPaths((paths) =>
      paths.map((path) =>
        path.smoothedPoints != null
          ? path
          : {
              ...path,
              smoothedPoints: {
                tolerance: 3,
                points: fitCurve(path.originalPoints, 3)
              }
            }
      )
    )
  }, [])

  useLayoutEffect(() => {
    document.body.addEventListener('mouseup', onMouseUpGlobal)

    return () => {
      document.body.removeEventListener('mouseup', onMouseUpGlobal)
    }
  }, [])

  return (
    <>
      <div className="canvas" onMouseDown={onMouseDown} onMouseMove={onMouseMove}>
        <svg width="600" height="400">
          {paths.map(({ originalPoints, smoothedPoints }, i) =>
            smoothedPoints != null ? (
              <path
                key={i}
                stroke="#000"
                strokeWidth="1"
                fill="none"
                d={smoothedPoints.points
                  .map(({ x, y }, i) =>
                    i % 4 === 0
                      ? i === 0
                        ? `M ${x} ${y}`
                        : ''
                      : i % 4 === 1
                      ? `C ${x} ${y}`
                      : `${x} ${y}`
                  )
                  .join(' ')}
              />
            ) : (
              <path
                key={i}
                stroke="#000"
                strokeWidth="1"
                fill="none"
                d={originalPoints
                  .map(({ x, y }, i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
                  .join(' ')}
              />
            )
          )}
        </svg>
      </div>
    </>
  )
}

function mouseEventToPoint(event: MouseEvent): Point {
  const rect = (event.target as Element).closest('.canvas')!.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

render(<App />, document.getElementById('app'))
