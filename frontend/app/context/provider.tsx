"use client"

import type React from "react"
import { ContextReducer } from "@/app/context/reducer"

import { createContext, useContext, useEffect, useState, useReducer, use } from "react"

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

    const sesionStorage: AnyType = JSON.parse(sessionStorage.getItem('flextudy') || "{}");

    const [context, setContext] = useState<AnyType>("")
    const [state, dispatch] = useReducer(ContextReducer, sesionStorage);

    useEffect(() => {
        if (state && state.flextudy) {
            sessionStorage.setItem("flextudy", JSON.stringify(state))
        }
    }, [state])

    const value = {
        context,
        setContext,
        state,
        dispatch,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
}