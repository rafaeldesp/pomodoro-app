import { PomodoroTimer  } from './components/pomodoro-timer'

function App() {


  return (
    <>
      <div className='container'> <PomodoroTimer pomodoroTime={6000} shortTimeRest={600} longRestTime={600} cycles={4}/></div>
    </>
  )
}

export default App
