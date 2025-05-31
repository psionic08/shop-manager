"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import TextWithLabel from "@/components/textWithLabel";


export default function SignupPage() {
    const router = useRouter();
    const [username,setUsername]= useState("")
    const [password,setPassword]= useState("")
    const [cnfPassword,setCnfPassword]= useState("")

    const onSignup = async () => {
        if(password==cnfPassword){
            try {
                const response = await axios.post("/api/users/signup", {username,password});
                if(response.data.success){
                    router.push("/login")
                }
                else{
                    alert(response.data.error)
                }
            } catch (error) {
                console.log("Signup failed", error.message);
            }
        }
        else{
            alert("password and confirm password do not match")
        }
    }


    return (
    <div className="w-full flex justify-center">
        <div className="flex flex-col w-100 items-center pt-12 gap-4">
            <TextWithLabel containerStyle="flex justify-between w-full gap-3" labelText="Username" inputValue={username} inputType="text" inputStyle="border-2 border-black rounded-sm" inputSetter={setUsername}></TextWithLabel>
            <TextWithLabel containerStyle="flex justify-between w-full gap-3" labelText="Password" inputValue={password} inputType="password" inputStyle="border-2 border-black rounded-sm" inputSetter={setPassword}></TextWithLabel>
            <TextWithLabel containerStyle="flex justify-between w-full gap-3" labelText="Confirm Password" inputValue={cnfPassword} inputType="password" inputStyle="border-2 border-black rounded-sm" inputSetter={setCnfPassword}></TextWithLabel>
            <button className="bg-blue-500 p-1 text-white rounded-sm" onClick={onSignup}>Sign Up</button>
        </div>
    </div>
    )

}