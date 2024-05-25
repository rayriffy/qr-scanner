import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'

import type { RefObject } from 'react'
import type { QrScannerLibOptions } from './types'

interface Options extends QrScannerLibOptions {
  onStart?: () => void
  onResult: (result: QrScanner.ScanResult) => void
  onError: (error: string | Error) => void
}

export const useQRScanner = (
  videoRef: RefObject<HTMLVideoElement>,
  { onStart, onResult, onError, ...rest }: Options
) => {
  const [initErrorMessage, setInitErrorMessage] = useState<string>()
  const scanner = useRef<QrScanner | null>(null)

  useEffect(() => {
    if (videoRef.current && !scanner.current) {
      scanner.current = new QrScanner(
        videoRef.current,
        result => {
          scanner.current?.stop()
          onResult(result)
        },
        {
          preferredCamera: 'environment',
          onDecodeError: err => {
            const errorString = err.toString()
            if (err && !errorString.includes('No QR code found')) {
              onError(err)
            }
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          calculateScanRegion: v => {
            const videoWidth = v.videoWidth
            const videoHeight = v.videoHeight
            const factor = 0.5
            const size = Math.floor(Math.min(videoWidth, videoHeight) * factor)
            return {
              x: (videoWidth - size) / 2,
              y: (videoHeight - size) / 2,
              width: size,
              height: size,
            }
          },
          ...rest,
        }
      )
    }
  })

  useEffect(() => {
    ;(async () => {
      try {
        await scanner.current?.start()
        if (onStart) {
          onStart()
        }
      } catch (error) {
        console.error(error)
        setInitErrorMessage((error as Error).toString())
      }
    })()
  }, [videoRef, onStart, onResult, onError])

  useEffect(() => {
    return () => {
      scanner.current?.stop()
      scanner.current?.destroy()
      scanner.current = null
    }
  })

  return { initErrorMessage }
}
