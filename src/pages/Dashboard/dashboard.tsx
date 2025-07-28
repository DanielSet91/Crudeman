import React from 'react'
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from '@mui/material'

const drawerWidth = 240

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {['GET', 'POST'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Typography variant="h5">Request Builder</Typography>

        <Box display="flex" gap={2} mt={2}>
          <Select defaultValue="GET">
            {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>

          <TextField fullWidth label="Request URL" variant="outlined" placeholder="https://api.example.com/" />

          <Button variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
