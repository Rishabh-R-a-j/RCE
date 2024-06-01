import React from "react";
import "./input.css";

function Input(props) {
  // function handleChange(newVal) {
  //   // console.log(newVal.target.value);

  //   // props.socket.emit("sendInput", newVal.target.value, () =>
  //   //   console.log("Input sent")
  //   // );
  // }

  return (
    <div id="main" >
        <h1 className={props.theme==='vs-light' ? "bg-white text-black underline" : "bg-black text-white underline"}>Input</h1>
      
      <textarea id="inx" onChange={(e)=>props.handleChange(e)} value={props.input} className={props.theme==='vs-light' ? "bg-white text-black " : "bg-black text-white "}></textarea>
    </div>
  );
}

export default Input;