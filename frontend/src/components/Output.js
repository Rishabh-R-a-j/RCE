import React from "react";
import "./output.css";
function output(props) {
  console.log(props.output)
  return (
    <div id="main" className={props.theme==='vs-light' ? "bg-white text-black " : "bg-black text-white "}>
      {/* <div className="input-title bg-red-900"> */}
        <span className={props.theme==='vs-light' ? "bg-white text-black underline" : "bg-black text-white underline"} value={props.output}>Output</span>
      {/* </div> */}
      <textarea  className={props.theme==='vs-light' ? "bg-white text-black inx" : "bg-black text-white inx"} value={props.output}></textarea>
    </div>
  );
}

export default output;