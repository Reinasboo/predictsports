import Navigation from './Navigation'
import BottomNavigation from './BottomNavigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="md:pt-16 pb-20 md:pb-0 px-4 md:px-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation Mobile */}
      <BottomNavigation />
    </div>
  )
}
