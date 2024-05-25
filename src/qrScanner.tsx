import { useRef } from 'react'
import { useQRScanner } from './useQRScanner'

import type { FunctionComponent } from 'react'
import type { QRScannerProps } from './types'

export const QRScanner: FunctionComponent<QRScannerProps> = ({
  error,
  onScan,
  ...rest
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const { initErrorMessage } = useQRScanner(videoRef, {
    onResult: result => onScan?.(result.data),
    onError: err => console.error(err),
  })

  if (initErrorMessage) return error ?? <div>{initErrorMessage}</div>

  return <video ref={videoRef} {...rest} />
}
