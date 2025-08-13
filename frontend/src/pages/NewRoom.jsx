import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebRTCStore } from '../store/useWebRTCStore';
import { useAuthStore } from '../store/useAuthStore';

const NewRoom = () => {
  const { userId: targetUserId } = useParams();
  console.log("target", targetUserId);
  
  const { makeCall, handleOffer, handleAnswer, handleIceCandidate, hangUp } = useWebRTCStore();
  const { socket, incomingCall  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {

    console.log("makeCall", targetUserId);
    
    if(!incomingCall) makeCall(targetUserId);

    socket.on('ice-candidates', (candidate) => {
      console.log("handling ice-candidates",candidate);
      handleIceCandidate(candidate);
    });

   
    
    socket.on('answer', (answer) => {
      handleAnswer(answer);
      console.log("handling answer",answer);
    });

    return () => socket.off('ice-candidates');
  }, []) 


  if(incomingCall){
    return(
      <div className='w-full h-screen flex justify-center items-center flex-col'>
        <div><h1>Incoming Call: {targetUserId}</h1></div>
        <div><button onClick={hangUp} className='bg-red-800 text-white w-20 h-10'>End Call</button></div>
    </div>
    )
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>

        <div><h1>Calling User: {targetUserId}</h1></div>

    </div>
  )
}

export default NewRoom