import { Suspense, lazy } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { AppProvider } from './context/AppProvider'
import { HomePage } from './pages/HomePage'

const CalendarPage = lazy(() => import('./pages/CalendarPage').then((module) => ({ default: module.CalendarPage })))
const ChatbotPage = lazy(() => import('./pages/ChatbotPage').then((module) => ({ default: module.ChatbotPage })))
const ClubPage = lazy(() => import('./pages/ClubPage').then((module) => ({ default: module.ClubPage })))
const HistoryGatePage = lazy(() =>
  import('./pages/HistoryGatePage').then((module) => ({ default: module.HistoryGatePage })),
)
const MatchesPage = lazy(() => import('./pages/MatchesPage').then((module) => ({ default: module.MatchesPage })))
const NewsPage = lazy(() => import('./pages/NewsPage').then((module) => ({ default: module.NewsPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const StorePage = lazy(() => import('./pages/StorePage').then((module) => ({ default: module.StorePage })))

function RouteLoader() {
  return (
    <section className="section-shell route-loader" aria-live="polite">
      <div className="route-loader__card">
        <p>Cargando contenido...</p>
      </div>
    </section>
  )
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="inicio" element={<Navigate to="/" replace />} />
              <Route path="actualidad" element={<NewsPage />} />
              <Route path="historia" element={<HistoryGatePage />} />
              <Route path="partidos" element={<MatchesPage />} />
              <Route path="calendario" element={<CalendarPage />} />
              <Route path="chatbot" element={<ChatbotPage />} />
              <Route path="tienda" element={<StorePage />} />
              <Route path="club" element={<ClubPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
