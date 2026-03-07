import { useMemo, useRef } from 'react'
import { useQRScanner } from './useQRScanner'

import type { FunctionComponent } from 'react'
import type { QRScannerProps } from './types'

export const QRScanner: FunctionComponent<QRScannerProps> = ({
  error,
  onScan,
  fullSize,
  resultBlockSize,
  overlayMainColor,
  overlayFinderColor,
  overlaySideColor,
  overlayTimeout,
  cropToSquare,
  textDecoder,
  ...videoProps
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const options = useMemo(
    () => ({
      fullSize,
      resultBlockSize,
      overlayMainColor,
      overlayFinderColor,
      overlaySideColor,
      overlayTimeout,
      cropToSquare,
      textDecoder,
    }),
    [
      fullSize,
      resultBlockSize,
      overlayMainColor,
      overlayFinderColor,
      overlaySideColor,
      overlayTimeout,
      cropToSquare,
      textDecoder,
    ]
  )

  const { initErrorMessage } = useQRScanner(videoRef, {
    ...options,
    onResult: result => onScan?.(result.data),
    onError: err => console.error(err),
  })

  if (initErrorMessage)
    return error?.(initErrorMessage) ?? <div>{initErrorMessage}</div>

  return <video ref={videoRef} {...videoProps} />
}
