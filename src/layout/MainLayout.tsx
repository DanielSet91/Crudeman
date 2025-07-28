import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HistoryIcon from '@mui/icons-material/History'
import { Link as RouterLink } from 'react-router-dom'

const drawerWidth = 240
const drawerItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'History', icon: <HistoryIcon />, path: '/history' },
]

interface MainLayoutProps {
  children: React.ReactNode
  toggleDrawer: () => void
  drawerOpen: boolean
  closeDrawer: () => void
}

const MainLayout = ({
  children,
  toggleDrawer,
  drawerOpen,
  closeDrawer,
}: MainLayoutProps ) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 100,
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Typography variant="h6" noWrap sx={{ mr: 2, color: '#0D47A1' }}>
            Crudeman
          </Typography>
          <IconButton edge="end" sx={{ color: '#0D47A1' }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <Box
          sx={{ width: drawerWidth }}
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === 'Tab' || event.key === 'Shift') return
            if (event.key === 'Escape') closeDrawer()
          }}
        >
          <List>
            {drawerItems.map(({ text, icon, path }) => (
              <ListItem disablePadding key={text}>
                <ListItemButton component={RouterLink} to={path} onClick={closeDrawer}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ mt: 8, flex: 1, px: 2 }}>{children}</Box>
    </Box>
  )
}

export default MainLayout
