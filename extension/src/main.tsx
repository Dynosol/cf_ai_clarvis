import { createRoot } from 'react-dom/client'
import './styles.css'
import Popup from './popup/Popup'
import { Providers } from '@/providers'

createRoot(document.getElementById('root')!).render(
  <Providers>
    <Popup />
  </Providers>
)
