import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { toast } from './hooks/use-toast'

function App() {
  return (
    <>
          <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
    </>
  )
}

export default App
