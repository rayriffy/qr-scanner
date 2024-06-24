import QrScanner from 'qr-scanner'
import type {
  ComponentProps,
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
} from 'react'

export type QRScannerLibOptions = Omit<
  ConstructorParameters<typeof QrScanner>[2],
  'onDecodeError'
>

export interface QRScannerProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
    'ref'
  > {
  error?: (errorMessage: string) => ReactNode
  onScan?: (text: string) => void
}
