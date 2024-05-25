# @rayriffy/qr-scanner

Just another QR scanner library for React.

```tsx
import { QRScanner } from '@rayriffy/qr-scanner'

const App = () => {
  return (
    <QRScanner
      onScan={result => {
        console.log(result)
      }}
    />
  )
}
```
