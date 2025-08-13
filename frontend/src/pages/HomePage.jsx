import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore'

import { useNavigate } from 'react-router-dom';
import { useWebRTCStore } from '../store/useWebRTCStore';

const HomePage = () => {
    const { connectSocket, authUser, onlineUsersMap, setIncomingCall, incomingCall, socket } = useAuthStore();
    const { handleOffer } = useWebRTCStore();
    //const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        if (authUser) {
            connectSocket();
        }

    }, [connectSocket])

    useEffect(() =>{
        console.log(socket);
        
       if(socket){
            console.log("handling offer");
            socket.on('offer', (offer) => {
                 console.log("offer- recieved", offer);
            setIncomingCall(true);
            navigate(`/new-room/${offer.senderUserId}`)
            handleOffer(offer);
        });

       }
    }, [socket])

    const call = (userId) => {
        //console.log(userId);
        
        navigate(`/new-room/${userId}`);
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                <div className='flex flex-col items-center '>
                    {(Object.keys(onlineUsersMap).length >= 2) ? (
                        Object.keys(onlineUsersMap).filter((user) => (user != authUser)).map((user) => (
                            <div key={user} className='bg-gray-200 border border-4 rounded-sm border-black w-[300px] flex items-center justify-between p-4'>
                                <p className='font-mono'>{user}</p>
                                <button className='font-mono text-bold text-red-800 border border-2 rounded-sm border-purple-800 pl-4 pr-4' onClick={() => call(user)}>Call</button>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h1>No Users Online</h1>
                        </div>
                    )

                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage