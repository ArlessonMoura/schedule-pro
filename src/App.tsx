import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProfileList from './pages/ProfileList'
import NotFound from './pages/NotFound'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<ProfileList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
