import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Client from '../components/Client';
import { initSocket } from '../socket';
import code from '../code-sync.png';
import Main from '../components/Main';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';


const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const codeRef=useRef(null);
    const languageRef=useRef(null);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit('join', {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                'joined',
                ({ clients, username, socketId }) => {
                    console.log(socketId);
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit('sync_code',{socketId,code:codeRef.current,language:languageRef.current})
                    socketRef.current.emit('sync_lang',{socketId,
                        language:languageRef.current})
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                'disconnected',
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        // return () => {
        //     socketRef.current.disconnect();
        //     socketRef.current.off('joined');
        //     socketRef.current.off('disconnected');
        // };
    }, []);


    if (!location.state) {
        return <Navigate to="/" />;
    }

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    return (
        <div className="mainWrap ">
            <div className="aside h-screen">
                <div className="asideInner h-screen">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src={code}
                            alt="logo"
                        />
                    </div>
                    <div className='flex flex-col justify-between h-[70vh]'>
                    <div>
                    <h3 className='my-2'>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                    </div>
                </div>
                <div className=''>
                <button className="btn copyBtn bg-white text-black w-full hover:bg-slate-300" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
                </div>
                </div>
            </div>
            <div className="editorWrap">
                <Main 
                    socketRef={socketRef}
                    roomId={roomId}
                    onChangeCode={(code)=>{
                        codeRef.current=code;
                    }}
                    onChangeLang={(lang)=>{
                        languageRef.current=lang;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;