import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";


function EditorFun(props) {
  const [curcode, setcurcode] = useState(props.code);
  useEffect(()=>{
    setcurcode(props.code);
  },[props.code])
  function handleChange(value) {
    setcurcode(value);
    props.changeCode(value);
   // console.log(value)
  //   props.socket.emit("sendCode", value);
    console.log("typing...");
  // }

  // props.socket.on("recivecode", (mssg) => {
  //   setcurcode(mssg);
  };
  console.log(curcode)

  return (
    <div id="main">
      <Editor
        height="100vh"
        width="100%"
        defaultLanguage="c"
        value={curcode}
        theme={props.theme}
        onChange={handleChange}
      />
    </div>
  );
}

export default EditorFun;