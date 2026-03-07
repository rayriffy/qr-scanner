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
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
    'ref'
  > {
  error?: (errorMessage: string) => ReactNode
  onScan?: (text: string) => void
}
