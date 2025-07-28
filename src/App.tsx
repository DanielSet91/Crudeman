import './App.css'
import { useState } from 'react'
import RootNavigator from './routes/RootNavigator'
import MainLayout from './layout/MainLayout'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  return (
    <>
      <MainLayout toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} closeDrawer={closeDrawer}>
        <RootNavigator />
      </MainLayout>
    </>
  )
}

export default App
