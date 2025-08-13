import { create } from "zustand";
import { io } from "socket.io-client"

export const useAuthStore = create((set, get) =>({
    authUser: null,
    roomId: null,
    socketId: null,
    onlineUsersMap: {},
    incomingCall: false,

    setIncomingCall: () =>{
        set({incomingCall: true});
    },

    setNewRoomId: (roomId) =>{
        set( {roomId: roomId} )
    },

    setAuthUser: (userId) =>{
        set({ authUser: userId })
        const { authUser } = get();
        console.log(authUser);
        
    },
    
    connectSocket: async() =>{

        const { authUser } = get();
        const socket = io("http://localhost:5000",{
            query: {
                userId: authUser, 
            }
        })

        socket.connect();
        set({socket: socket});
        
        socket.on('conn. successful', (socketId)=>{
            console.log("connected");
            set({socketId: socketId});
            //console.log(socketId);
            
        })
        socket.on('online-users', (onlineUsersMap)=>{
                console.log(onlineUsersMap);
                set({onlineUsersMap: onlineUsersMap});
        })

    }, 
    
    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect();
    }
})) 