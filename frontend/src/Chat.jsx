import React, { useEffect, useState } from 'react'
import {Card,CardContent,Container,Icon,FormField, Form, Message, Divider } from 'semantic-ui-react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { Header } from 'semantic-ui-react';


const Chat = ({socket,username,room}) => {

    const [currentMessage,setCurrentMessage] = useState ("");
    const [messagesList,setMessagesList] = useState ([]);

    const sendMessage = async () => {
        if(username && currentMessage){
            const info = {
                message: currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours()+":"+new Date().getMinutes(),
            };

            await socket.emit("send_message",info)
            setMessagesList((list)=>[...list,info]);
            setCurrentMessage("")
        }
    };

    useEffect(()=> {
        const messageHandle = (data) => {
                setMessagesList((list)=>[...list,data]);
        }
        socket.on("receive_message", messageHandle)

        return () => socket.off("receive_message", messageHandle)
    },[socket])

  return (
<Container>
    <Card fluid>
        <CardContent header={`Chat de Trabajo | Grupo: ${room}`} />
        <ScrollToBottom>
            <CardContent style={{ height: '500px', padding: '20px' }}>
                {messagesList.map((item, i) => (
                    <span key={i}>
                        <Message style={{ textAlign: username === item.author ? 'right' : 'left' }} success={username === item.author} color={username === item.author ? 'light blue violet' : 'yellow'}>
                            <Header>{item.message}</Header>
                            <p> Enviado: <strong> {item.author}</strong> |<i>{item.time}</i> </p>
                        </Message>
                        <Divider></Divider>
                    </span>
                ))}
            </CardContent>
        </ScrollToBottom>

        <CardContent extra>
            <Form>
                <FormField>
                    <div className='ui action input'>
                        <input
                            value={currentMessage}
                            type="text"
                            placeholder='Mensaje'
                            onChange={e => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") sendMessage()
                            }} />

                        <button type='button' onClick={() => sendMessage()} className='ui blue icon right labeled button'>
                            <Icon name='send'></Icon>
                            Enviar
                        </button>
                    </div>
                </FormField>
            </Form>
        </CardContent>
    </Card>
</Container>


  )
}

export default Chat