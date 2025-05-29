"use client"
export default function TextWithLabel({containerStyle,labelStyle,inputStyle,labelText,inputValue,inputSetter,inputType}){
    return(
        <div className={containerStyle}>
            <div className={labelStyle}>{labelText}</div>
            <input className={inputStyle} value={inputValue} onChange={(e)=>inputSetter(e.target.value)} type={inputType}></input>
        </div>
    )
}