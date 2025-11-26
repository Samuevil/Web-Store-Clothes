import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import Admin from './Pages/Admin/Admin'

const App = () => {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column', 
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Navbar style={{ flexShrink: 0 }} /> 
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden'
      }}>
        <Sidebar /> 
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '20px'
        }}>
          <Admin /> 
        </div>
      </div>
    </div>
  )
}

export default App