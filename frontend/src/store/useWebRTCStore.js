import { create } from 'zustand'
import { useAuthStore } from './useAuthStore'

export const useWebRTCStore = create((set, get) => ({
    pc: null,
    target: null,
    configuration: {
        iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
        ],
        iceCandidatePoolSize: 10,
    },

    makeCall: async (targetUserId) => {
        try {
            const {onlineUsersMap, socket, authUser} = useAuthStore.getState();
            const {configuration} = get();
            console.log(socket);
            
            const targetSocketId = onlineUsersMap[targetUserId];
            set({target: targetSocketId});
            
            const pc = new RTCPeerConnection(configuration);
            set({pc: pc});
           // console.log("targetid" ,target);
            const {target} = get();
            console.log("targetid", target);
            
            pc.onicecandidate = (e) => {
                console.log("E: ", e);
                
                const message = {
                    type: "candidate",
                    targetId: target,
                    candidate: {
                        type: "candidate",
                        candidate: null,
                    }, 
                    senderUserId: authUser 
                };
    
                if(e.candidate){
                    message.candidate.candidate = e.candidate.candidate;
                    message.candidate.sdpMid = e.candidate.sdpMid;
                    message.candidate.sdpMLineIndex = e.candidate.sdpMLineIndex;
                    socket.emit("ice-candidates", message);
                }
    
            }
    
             
            const dc = pc.createDataChannel("channel");
            dc.onmessage = e => console.log("just got a message" + e.data);
            dc.onopen = e => console.log("connection open");
            
            //create offer
            const offer = await pc.createOffer();
        
            socket.emit("offer", {type: "message",
                targetId: target,
                offer: {
                    type: "offer",
                    sdp: offer.sdp
                },
                senderUserId: authUser
            })
    
            await pc.setLocalDescription(offer);

        } catch (error) {
            console.log("error in make call", error); 
        }

    },

    handleOffer: async (offer) => {

        try {
            const {onlineUsersMap, socket, authUser} = useAuthStore.getState();
            const {configuration} = get();
            const targetUserId = offer.senderUserId;
            const targetSocketId = onlineUsersMap[targetUserId];
            set({target: targetSocketId});
           
            const {target} = get();
            const pc = new RTCPeerConnection(configuration);
            set({pc: pc});

            pc.onicecandidate = (e) => {
                console.log("sending ice-candidates");
                
                 const message = {
                    type: "candidate",
                    targetId: target,
                    candidate: {
                        type: "candidate",
                        candidate: null,
                    }, 
                    senderUserId: authUser 
                };
    
                if(e.candidate){
                    message.candidate.candidate = e.candidate.candidate;
                    message.candidate.sdpMid = e.candidate.sdpMid;
                    message.candidate.sdpMLineIndex = e.candidate.sdpMLineIndex;
                    socket.emit("ice-candidates", message);
                }else{
                    console.log("NO Candidates");
                    
                }

            }

            pc.ondatachannel = e => {
                pc.dc = e.channel,
                pc.dc.onmessage = e => console.log("Message from user 1" + e.data),
                pc.dc.onopen = e => console.log("opened");
            }

            await pc.setRemoteDescription(offer.offer);
            console.log("offer-settled");

            const answer = await pc.createAnswer();

            socket.emit("answer", { type: "answer",
                targetId: target,
                answer: {
                    type: "answer",
                    sdp: answer.sdp,
                },
                senderUserId: authUser
            });

            await pc.setLocalDescription(answer);
            
        } catch (error) {
            console.log("error in  handlOffer", error);
        }
    },

    handleIceCandidate: async (candidate) =>{

        const {pc} = get();

        try {
            if(!pc){
                console.log("No Peer Connection");
                return
            }
    
            if(!candidate){
                await pc.addIceCandidate(null);
            }else{
                await pc.addIceCandidate(candidate.candidate);
            }

        } catch (error) {
                console.log("error in ice-candidates", error);
        }
    },

    handleAnswer: async (answer) => {

        const {pc} = get();

        if(!pc){
            console.log("No connection");
            return;
        }

        try {
            if(!answer){
                await pc.setRemoteDescription(null)
            }else{
                console.log("answer-settled");
                
                await pc.setRemoteDescription(answer.answer);
            }
        } catch (error) {
            console.log("Error in handle answer", error);
        }
    },

    hangUp: () => {
        const {pc} = get();
        if(pc){
            pc.close();
            pc = null;
        }
    }

}))