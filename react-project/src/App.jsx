import { Routes, Route } from 'react-router-dom'
import App_pomodoro from './App_pomodoro'
import App_achievement from './App_achievement'

function App() {
  return (
    <Routes>
      <Route path="/" element={<App_pomodoro />} />          
      <Route path="/pomodoro" element={<App_pomodoro />} />
      <Route path="/achievement" element={<App_achievement />} />
    </Routes>
  )
};

export default App;