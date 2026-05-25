import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

function Header() {
  return (
    <header className="app-header bg-white border-b">
      <div className="app-container p-4">
        <h1 className="text-lg font-semibold">Health Plan</h1>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="app-footer bg-white border-t">
      <div className="app-container p-4 text-sm text-gray-500">© {new Date().getFullYear()} Health Plan</div>
    </footer>
  )
}

export const Layout = () => {
  return (
    <div className="app-layout">
      <div className="app-sidebar">
        <Sidebar />
      </div>
      <div className="app-main flex flex-col">
        <Header />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
