import React, { useState, useEffect,useRef } from "react";
import Editor from "@monaco-editor/react";

function EditorFun({socketRef,roomId,code,theme,changeCode,socketid,language,onChangeCode}) {
  
  const [curcode, setcurcode] = useState(code);
  useEffect(()=>{
    setcurcode(code);
    onChangeCode(code);
    if (socketRef.current) {
      socketRef.current.emit('code_change',{
        roomId,code,language
      });
    }
  },[code])
  
  function handleChange(value) {
    setcurcode(value);
    changeCode(value);
    onChangeCode(value)
    console.log("typing...");
    socketRef.current.emit('code_change',{
      roomId,code:curcode
    })
    // socketRef.current.emit('sync_code',{
    //   socketId,code,language
    // });
  };
  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on('code_change', ({ code }) => {
            if (code !== null) {
                setcurcode(code);
            }
        });
    }

    return () => {
        socketRef .current.off('code_change');
    };
}, [socketRef.current]);



  return (
    <div id="main">
      <Editor
        height="100vh"
        width="100%"
        defaultLanguage="c"
        value={curcode}
        theme={theme}
        onChange={handleChange}
      />
    </div>
  );
}

export default EditorFun;