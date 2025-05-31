"use client"
import TextWithLabel from "@/components/textWithLabel";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router= useRouter()
  const [username,setUsername]= useState("")
  const [password,setPassword]= useState("")

  const onLogin= async()=>{
    try{
      const response= await axios.post("/api/users/login",{username,password})
      console.log(response)
      if(response.status==200){
        if(response.data.success)router.push("/")
        else alert(response.data.error)
      }
      else{
        alert("backend error")
      }
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className="w-full flex justify-center">
      <div className="w-100 gap-4 flex flex-col items-center pt-10">
      <TextWithLabel containerStyle="flex justify-between w-full gap-3" labelText="Username" inputValue={username} inputType="text" inputStyle="border-2 border-black rounded-sm" inputSetter={setUsername}></TextWithLabel>
      <TextWithLabel containerStyle="flex justify-between w-full gap-3" labelText="Password" inputValue={password} inputType="password" inputStyle="border-2 border-black rounded-sm" inputSetter={setPassword}></TextWithLabel>
      <button onClick={onLogin} className="bg-blue-500 p-1 text-white rounded-sm">Login</button>
      <div className="flex gap-1">
        <div>Dont have an account?</div>
        <div className="text-blue-500 underline"onClick={()=>{router.push("/signup")}}>Sign up</div>
      </div>
      </div>
    </div>
  );
}
