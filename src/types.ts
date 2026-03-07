import type {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react'
import type { QRCanvasOpts } from 'qr/dom.js'

export type QRScannerLibOptions = Partial<QRCanvasOpts> & {
  fullSize?: boolean
}

export interface QRScannerProps
  extends QRScannerLibOptions,
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
      'ref' | keyof QRScannerLibOptions
    > {
  error?: (errorMessage: string) => ReactNode
  onScan?: (text: string) => void
}
