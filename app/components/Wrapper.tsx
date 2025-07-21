import React from "react"
import Navbar from "./Navbar"
import { ClerkProvider } from "@clerk/nextjs"

type WrapperProps = {
    children : React.ReactNode
} 

const Wrapper = ({children} : WrapperProps) => {
  return (
    <div>
        <Navbar />
        <div className="px-5 md:px-[10%] mt-10 mb610">
            {children}
        </div>
    </div>
  )
}

export default Wrapper