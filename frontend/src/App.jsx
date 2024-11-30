import { useState } from 'react'
import './App.css'

import io from 'socket.io-client'
import Chat from './Chat'
import { Card,Form,Button,CardContent,Icon,Container,FormField,Divider } from 'semantic-ui-react'


const socket = io.connect("http://localhost:3001")

function App() {
  const [username,setUsername] = useState("")
  const [room,setRoom] = useState("")
  const [showChat,setShowChat] = useState(false)

  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room",room)
      setShowChat(true)
    }
  };
 

  return (
    <>
    <Container>
      
      {!showChat? (
      <Card fluid>
        <CardContent header='Unirme al chat' />
          <CardContent>
        <Form>
          <FormField>
            <label>Username:</label>
            <input 
              type="text" 
              placeholder='Michael...' 
              onChange={(e)=> setUsername(e.target.value)}
            />
          </FormField>
          <FormField>
            <label>Sala:</label>
            <input 
              type="text" 
              placeholder='ID Sala:' 
              onChange={(e)=> setRoom(e.target.value)}
              />
          </FormField>
          <Button onClick={joinRoom}>Unirme</Button>
        </Form>
          </CardContent>
            <CardContent extra>
            <Icon name='user' />4 Friends
            </CardContent>
          </Card>
      ):(
        <Chat socket={socket} username={username} room={room}/>
      )}
      </Container>
    </>
  )
}

export default App
