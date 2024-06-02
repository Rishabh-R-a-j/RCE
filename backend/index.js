const express=require('express');
const cors=require('cors');
const Axios = require("axios");
const port=process.env.PORT || 8080;
//import { returncode } from "../utils/defaultCode";
const app=express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

console.log(process.env.JDoodle_ClientID)

// app.post("/compile", (req, res) => {
//     //getting the required data from the request
//     let code = req.body.code;
//     let language = req.body.language;
//     let input = req.body.input;

//     // console.log(code);
//     // console.log(language);
//     // console.log(input);
//     if (language === "python") {
//         language = "py"
//     }

//     let data = ({
//         "code": code,
//         "language": language,
//         "input": input
//     });
//     let config = {
//         method: 'post',
//         url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: data
//     };
//     //calling the code compilation API
//     Axios(config)
//         .then((response) => {
//             console.log("Sent");
//             res.send(response.data)
//            // console.log(response.data)
//         }).catch((error) => {
//         //     console.log("Error");
//         console.log(error);
//         });
// })
// sk-proj-ceLrFzu9GLM74MvWGXgOT3BlbkFJidlgFNfwzFb2VL3Ik9nR
// { apiKey: "sk-proj-ceLrFzu9GLM74MvWGXgOT3BlbkFJidlgFNfwzFb2VL3Ik9nR" }
const JDoodle_ClientID = process.env.JDoodle_ClientID.toString();
const JDoodle_ClientSecret = process.env.JDoodle_ClientSecret.toString();
console.log(JDoodle_ClientID,JDoodle_ClientSecret)
app.post('/compile', async (req, res) => {
    const { code, language, input } = req.body;
    console.log(req.body);
    const langMap = {
        javascript: 'nodejs',
        python: 'python3',
        java: 'java',
        c: 'c',
        cpp: 'cpp14',
        // Add more mappings as needed
      };
    
      const lang = langMap[language.toLowerCase()];
    
      if (!lang) {
        return res.status(400).send({ error: 'Unsupported language' });
      }
    
      const data = {
        script: code,
        language: lang,
        versionIndex: '0',
        clientId: JDoodle_ClientID,
        clientSecret: JDoodle_ClientSecret,
        stdin: input
      };
    
      try {
        const response = await Axios.post('https://api.jdoodle.com/v1/execute', data);
        console.log(response.data.output);
        res.status(200).send({ result: response.data.output });
      } catch (error) {
        console.log("Hello 2");
        console.error('Error executing code:', error.message);
        res.status(500).send({ error: 'Error executing code' });
      }
    });
    
    
const server = app.listen(port, () => console.log('Server started on port 8080'));

const io= require("socket.io")(server,{
    cors: {
        origin: '*'
    },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}


io.on('connection',socket=>{
    console.log("Connected to ",socket.id)

    socket.on('join',({roomId,username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
       // console.log(clients)
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    })

    socket.on('code_change',({roomId,code})=>{
        socket.to(roomId).emit('code_change',{code});
    })
    socket.on('language_change',({roomId,language})=>{
       // console.log(language,"lsang_change");
        socket.to(roomId).emit('language_change',{language})
    })
    socket.on('sync_code', ({ socketId, code,language }) => {
      //  console.log(code,language)
        socket.to(socketId).emit('code_change', {code,language });
    });
    socket.on('sync_lang', ({ socketId, language }) => {
     //   console.log(language,'sync_lang')
        socket.to(socketId).emit('language_change', {language});
    });

    socket.on('disconnecting',() => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.to(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
})