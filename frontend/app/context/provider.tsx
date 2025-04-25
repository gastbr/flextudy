"use client"

import type React from "react"
import { ContextReducer } from "@/app/context/reducer"

import { createContext, useContext, useEffect, useState ,useReducer} from "react"

type AnyType = any

// Create a context with a default value
const Context = createContext<AnyType | undefined>(undefined)




// Custom hook to use the theme context
export function useProvider() {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}

// Provider component that wraps your app and makes theme available to any child component
export function ContextProvider({ children }: { children: React.ReactNode }) {
    const [context, setContext] = useState<AnyType>("")
    const [state, dispatch] = useReducer(ContextReducer, {});
    
    const addCampo = (campo:any, payload:any) => {
        dispatch({ type: "ADD", campo, payload });
    };

    // Load saved theme from localStorage on initial render
    // useEffect(() => {
    //     const savedTheme = localStorage.getItem("theme") as Theme
    //     if (savedTheme) {
    //         setTheme(savedTheme)
    //         document.documentElement.classList.toggle("dark", savedTheme === "dark")
    //     }
    // }, [])

    // Toggle between light and dark themes
    // const toggleTheme = () => {
    //     setTheme((prevTheme) => {
    //         const newTheme = prevTheme === "light" ? "dark" : "light"
    //         // Save to localStorage
    //         localStorage.setItem("theme", newTheme)
    //         // Toggle dark class on html element
    //         document.documentElement.classList.toggle("dark", newTheme === "dark")
    //         return newTheme
    //     })
    // }

    const value = {
        context,
        setContext,
        state,
        dispatch,
        addCampo
        // toggleTheme,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
}