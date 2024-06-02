import React, { useState, useEffect } from "react";
import { DropdownButton, Dropdown, Navbar, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { returncode } from "../utils/defaultCode";
//import Editor from "./EditorFun";
import Input from "./Input";
import Output from "./Output";
import EditorFun from "./EditorFun";
// import io from "socket.io-client";
import "./Main.css";
import { returnIdx } from "../utils/defaultCode";
import spinner from './spinner.svg';

// const socket = io.connect("http://localhost:4000");

function Main({socketRef,roomId,socketid,onChangeCode,onChangeLang}) {
  const [language, setLanguage] = useState("cpp");
  const [codeidx, setCodeidx] = useState(1);
  const [theme, setTheme] = useState("vs-light");
  const [code, setCode] = useState(returncode(1));
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  function changeLanguage(e) {
    //console.log(e.target.value)
    if (e.target.value === "cpp") {
      setLanguage("cpp");
      setCodeidx(1);
      let codeval=returncode(1);
      //console.log(codeval);
      setCode(codeval);
      //console.log(code);
    } else if (e.target.value === "python") {
      setLanguage("python");
      setCodeidx(2);
      let codeval=returncode(2);
     // console.log(codeval);
      setCode(codeval);
      //console.log(code);
    } else if(e.target.value === "javascript") {
      setLanguage("javascript");
      setCodeidx(3);
      let codeval=returncode(3);
     // console.log(codeval);
      setCode(codeval);
     // console.log(code);
    }
   // console.log("codeidx",codeidx)
   onChangeLang(e.target.value);
   socketRef.current.emit('language_change',{roomId,language:e.target.value});
  }
  async function  compile() {
    setLoading(true);
    if (code === ``) {
        return
    }

    // Post request to compile endpoint
   await Axios.post(`http://localhost:8080/compile`, {
        code: code,
        language : language,
        input : input
    }).then((res) => {
        setOutput(res.data.result);
        // console.log(res.data.result);
    }).then(() => {
        setLoading(false);
    })
}
console.log(output);
function clearOutput() {
  setOutput("");
}
 
// if (socketRef.current) {
//   socketRef.current.on('code_change', ({ code,language }) => {
//     if (code !== null) {
//         setCode(code);
//     }
//     if(language!==null){
//       setLanguage(language)
//       onChangeLang(language)
//     }});
//     socketRef.current.on('language_change', ({language }) => {
//       console.log(language)
//     if(language){
//       setLanguage(language)
//       document.getElementById('dropdown-item-button').value =language
//       onChangeLang(language)
//     } 
//     });
// }

useEffect(()=>{
  if (socketRef.current) {
    socketRef.current.on('language_change',({language})=>{
      console.log(language)
    if(language){
      setLanguage(language)
      document.getElementById('dropdown-item-button').value =language
    } 
    });
    return () => {
      socketRef .current.off('language_change');
  };
  }
},[socketRef.current])




useEffect(()=>{
  if (socketRef.current) {
    onChangeLang(language)
    socketRef.current.emit('language_change',{roomId,language});
  }
},[language])



  function changeTheme(e) {
    if (theme === "vs-light") {
      setTheme("vs-dark");
    } else {
      setTheme("vs-light");
    }
  }
  const { user } = useParams();

//   useEffect(() => {
//     var res = user.split("-");
//     const username = res[0];
//     const userroomid = res[1];
//     socket.emit("joinroom", { username, userroomid });

//     socket.on("joinedmssg", (username) => {
//       // console.log(username);
//       toast.success(`${username} has joined the Room`);
//     });

//     socket.on("leavemssg", (username) => {
//       // console.log(username);
//       toast.warning(`${username} has left the Room`);
//     });

//     socket.on("getInput", (mssg) => {
//       // console.log(mssg);
//       setInput(mssg);
//     });
//   }, []);

//   async function sendCodetoServer() {
//     // console.log(code);
//     // console.log(input);
//     const { data } = await axios.post("http://localhost:4000/", {
//       code: code,
//       lang: "cpp",
//       input: input,
//     });
//     setOutput(data);
//     console.log(data);
//   }
function handleChange(e){
setInput(e.target.value);
}
  return (
    <>
      {/* /* Navbar code*/}
      <Navbar bg="light" expand="lg" className={theme==='vs-light' ? "bg-white text-black" : "bg-[#1e1e1e] text-white"}>
        <Navbar.Brand href="/" className="font-bold">Code Clan</Navbar.Brand>
        <Button
          variant="light"
          size="sm"
          onClick={changeTheme}
          className="main-button"
        >
          Change Theme
        </Button>
        <Button
          variant="light"
          size="sm"
         onClick={()=>compile()}
          className="main-button"
        >
          Run code
        </Button>
        <select name="language"  id="dropdown-item-button" defaultValue={language} onChange={(e)=>{changeLanguage(e)}} className={theme==='vs-light' ? "bg-white text-black" : "bg-black text-white"}>
            <option value= "cpp" >c++</option>
            <option value= "python">Python</option>
            <option value= "javascript">Javascript</option>
        </select>
      </Navbar>
      <ToastContainer />
      {/* /*navbar code completed*/}
      <div className="screen">
        <div className="left">
          <EditorFun
            theme={theme}
            code={code}
            socketRef={socketRef}
            socketId={socketid}
            roomId={roomId}
            language={language}
            onChangeCode={onChangeCode}
            // socket={socket}
            changeCode={setCode}
          />
        </div>
        <div className="right">
        <Input
        theme={theme}
        value={input}
        handleChange={handleChange}
      />
         {loading ? (
                        <div className="h-[400px] w-full bg-white flex items-center  justify-center">
                            <img src={spinner} alt="Loading..." className="h-[70px]"/>
                        </div>
                    ) : (
                      <Output output={output} theme={theme}  />
                    )}
                    <button onClick={() => { clearOutput() }}
                                className="clear-btn">
                                Clear
                            </button>  
          
        </div>
      </div>
    </>
  );
}

export default Main;