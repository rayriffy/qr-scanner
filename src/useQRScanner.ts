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
  {
    onStart,
    onResult,
    onError,
    fullSize,
    resultBlockSize,
    overlayMainColor,
    overlayFinderColor,
    overlaySideColor,
    overlayTimeout,
    cropToSquare,
    textDecoder,
  }: Options
) => {
  const [initErrorMessage, setInitErrorMessage] = useState<string>()
  const camera = useRef<Awaited<ReturnType<typeof frontalCamera>> | null>(null)
  const canvas = useRef<QRCanvas | null>(null)
  const stopFrameLoop = useRef<(() => void) | null>(null)
  const hasResult = useRef(false)

  useEffect(() => {
    let unmounted = false
    let removePlayListener: (() => void) | undefined
    const startFrameLoop = () => {
      if (stopFrameLoop.current) return
      stopFrameLoop.current = frameLoop(() => {
        try {
          if (!canvas.current || !camera.current || hasResult.current) return
          const data = camera.current.readFrame(canvas.current, fullSize ?? true)
          if (!data) return
          hasResult.current = true
          stopFrameLoop.current?.()
          camera.current.stop()
          onResult({ data })
        } catch (error) {
          onError(error as Error)
        }
      })
    }

    ;(async () => {
      try {
        const videoElm = videoRef.current
        if (!videoElm) return
        canvas.current = new QRCanvas(undefined, {
          resultBlockSize,
          overlayMainColor,
          overlayFinderColor,
          overlaySideColor,
          overlayTimeout,
          cropToSquare,
          textDecoder,
        })
        camera.current = await frontalCamera(videoElm)
        if (unmounted) return

        if (videoElm.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          startFrameLoop()
        } else {
          const onPlay = () => startFrameLoop()
          videoElm.addEventListener('play', onPlay)
          removePlayListener = () => videoElm.removeEventListener('play', onPlay)
        }

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
      removePlayListener?.()
      camera.current?.stop()
      camera.current = null
      canvas.current?.clear()
      canvas.current = null
    }
  }, [
    videoRef,
    onStart,
    onResult,
    onError,
    fullSize,
    resultBlockSize,
    overlayMainColor,
    overlayFinderColor,
    overlaySideColor,
    overlayTimeout,
    cropToSquare,
    textDecoder,
  ])

  return { initErrorMessage }
}
