import { signupInput } from "@adarsh9977/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate= useNavigate()
    const [postInputs, setPostInputs] = useState<signupInput>({
        email:"",
        password:"",
        name:""
    })

    async function sendRequest(){
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup"? "signup":"signin"}`, postInputs);
            console.log(response);
            const jwt = response.data.token;
            console.log(jwt);
            localStorage.setItem("token", jwt);
            navigate("/blogs")
        } catch (error) {
            alert("Error while signingup")
        }
    }

  return (
    <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div >
                <div className="px-10">
                    <div className="text-3xl font-extrabold " >
                        Create an account  
                    </div>
                    <div className="text-slate-400">
                        {type==="signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type==="signin"?"/signup":"/signin"} >
                        {type === "signin"? "Sign up": "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-5">
                    <Labelledinput label="Email" placeholder="example@gmail.com" onChange={(e)=>{
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value,

                        })
                    }}/>
                    {type === "signup" ? <Labelledinput label="Name" placeholder="Adarsh Tiwari" onChange={(e)=>{
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value,

                        })
                    }}/>:null}
                    <Labelledinput label="password" type="password" placeholder="Ab!@#123" onChange={(e)=>{
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value,
                        })
                    }}/>

                    <button onClick={sendRequest} type="button" className="mt-8 text-white w-full  bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 ">{type === "signup" ? "Sign up": "Sign In"}</button>
                </div>
            </div>
        </div> 
    </div>
  )
}

interface LabelledInputType{
    label:       string;
    placeholder: string;
    onChange:    (e:ChangeEvent<HTMLInputElement>) => void;
    type?:       string 
}

function Labelledinput({ label, placeholder, onChange, type }:LabelledInputType){
    return <div className="mt-3"> 
    <label  className="block mb-2 text-sm font-semibold text-black">{label}</label>
    <input onChange={onChange} type={type || "text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
</div>
}
