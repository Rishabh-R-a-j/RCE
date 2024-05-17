import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
// import ACTIONS from '../Actions';
import Client from '../components/Client';
// import { initSocket } from '../socket';
import code from '../code-sync.png';
import Main from '../components/Main';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const clients = [
  {
    username: "Riddhi",
    socketId: "yui"
  },
  {
    username: "Priyanshu",
    socketId: "yuooi"
  },
  {
    username: "Aman",
    socketId: "yuooii"
  }
]

const EditorPage = () => {


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
                <button className="btn copyBtn bg-white text-black w-full hover:bg-slate-300" >
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" >
                    Leave
                </button>
                </div>
                </div>
            </div>
            <div className="editorWrap">
                <Main />
            </div>
        </div>
    );
};

export default EditorPage;