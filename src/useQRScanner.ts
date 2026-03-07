import { useEffect, useRef, useState } from 'react'
import { QRCanvas, frameLoop, frontalCamera } from 'qr/dom.js'

import type { RefObject } from 'react'
import type { QRScannerLibOptions } from './types'

type ScanResult = {
  data: string
}

interface Options extends QRScannerLibOptions {
  onStart?: () => void
  onResult: (result: ScanResult) => void
  onError: (error: string | Error) => void
}

export const useQRScanner = (
  videoRef: RefObject<HTMLVideoElement>,
  { onStart, onResult, onError, fullSize, ...rest }: Options
) => {
  const [initErrorMessage, setInitErrorMessage] = useState<string>()
  const camera = useRef<Awaited<ReturnType<typeof frontalCamera>> | null>(null)
  const canvas = useRef<QRCanvas | null>(null)
  const stopFrameLoop = useRef<(() => void) | null>(null)
  const hasResult = useRef(false)

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      try {
        if (!videoRef.current) return
        canvas.current = new QRCanvas(undefined, rest)
        camera.current = await frontalCamera(videoRef.current)
        if (unmounted) return

        stopFrameLoop.current = frameLoop(() => {
          try {
            if (!canvas.current || !camera.current || hasResult.current) return
            const data = camera.current.readFrame(canvas.current, fullSize)
            if (!data) return
            hasResult.current = true
            stopFrameLoop.current?.()
            camera.current.stop()
            onResult({ data })
          } catch (error) {
            onError(error as Error)
          }
        })

        if (onStart) {
          onStart()
        }
      } catch (error) {
        if (!unmounted) {
          setInitErrorMessage((error as Error).toString())
        }
      }
    })()

    return () => {
      unmounted = true
      hasResult.current = false
      stopFrameLoop.current?.()
      stopFrameLoop.current = null
      camera.current?.stop()
      camera.current = null
      canvas.current?.clear()
      canvas.current = null
    }
  }, [videoRef, onStart, onResult, onError, fullSize, rest])

  return { initErrorMessage }
}
