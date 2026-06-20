import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#faf6f0' }}>
      <Sidebar />
      <div style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title={title} />
        <main style={{ flex: 1, padding: '32px 40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}