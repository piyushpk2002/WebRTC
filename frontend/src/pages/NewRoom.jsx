import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebRTCStore } from '../store/useWebRTCStore';
import { useAuthStore } from '../store/useAuthStore';

const NewRoom = () => {
  const { userId: targetUserId } = useParams();
  console.log("target", targetUserId);

  const { makeCall,handleOffer, handleAnswer, handleIceCandidate, hangUp, messages, sendMessage, setLocalStream, localStream, remoteStream } = useWebRTCStore();
  const { socket, incomingCall, setIncomingCall } = useAuthStore();
  const [acceptedCall, setAcceptedCall] = useState(false);
  const navigate = useNavigate();
  const localVideo = useRef();
  const remoteVideo = useRef();

  const handleMessages = (e)=>{
    e.preventDefault();
    console.log(e.target.message.value);
    sendMessage(e.target.message.value)
  }
  const acceptCall = ()=>{
    
      socket.emit('call-accepted', {targetId: targetUserId})
      setAcceptedCall(true)
      setIncomingCall(false)

  }

  

  useEffect(() => {

    const startVideo = async () =>{
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        console.log(localStream);
        
        //setting local Stream in the store
        setLocalStream(localStream)

        if(localVideo.current) localVideo.current.srcObject = localStream;


      } catch (error) {
        console.log("Error in start fn", error);
      }

    }

    startVideo();

    //console.log("makeCall", targetUserId);

    socket.on('offer', (offer) => {
      console.log("Handling offer");
      handleOffer(offer)
    })

    socket.on('ice-candidates', (candidate) => {
      console.log("handling ice-candidates", candidate);
      handleIceCandidate(candidate);
    });

    
    socket.on('answer', (answer) => {
      handleAnswer(answer);
      console.log("handling answer", answer);
    });

    socket.on('call-accepted', () =>{
      console.log("Initiating-conn.");
      if(!incomingCall)makeCall(targetUserId);
      setAcceptedCall(true)
      setIncomingCall(false)
    })

    return () => {
      socket.off('ice-candidates')
    };

  }, [])

  useEffect(() => {
    if(remoteStream && remoteVideo.current){
      remoteVideo.current.srcObject = remoteStream
      console.log("remoteStream", remoteStream.current);

      if(localVideo.current) localVideo.current.srcObject = localStream;
      
    }
  }, [remoteStream, localStream])


  if (incomingCall) {
    return (
      <div className='w-full h-screen flex justify-center items-center flex-col'>
        <div><h1>Incoming Call: {targetUserId}</h1></div>
        <div>
          <button onClick={acceptCall} className='bg-red-800 text-white w-20 h-10'>Accept</button>
          <button onClick={hangUp} className='bg-red-800 text-white w-20 h-10'>End Call</button>
        </div>
      </div>
    )
  }

  if (acceptedCall) {
    return (
      <div>
        {/* <div>
              {
                messages.length > 0 ? messages.map((m) =>(
                  <p key={m}>
                      {m.sender}
                      <span key={m}>{m.msg}</span>
                  </p>
                )):
                <p>No Meesages !!</p>
              }
        </div> */}
        {/* <form onSubmit = {handleMessages}>
          <input type="text"
            name='message'
            placeholder='Enter your Message'
            className='border border-lg border-purple-800' />
            <button type='submit' className='border border-lg border-black p-2'>Send</button>
        </form> */}
        <h1>Local Stream</h1>
        <video 
          src= " "
          ref = {localVideo}
          className="w-[300px] h-[400px] bg-black rounded-lg"
          autoPlay
          playsInline>  
        </video>
        <h1>Remote Stream</h1>
        <video 
          src=" "
          ref = {remoteVideo}
          className="w-[300px] h-[400px] bg-black rounded-lg"
          autoPlay
          playsInline> 
        </video>
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