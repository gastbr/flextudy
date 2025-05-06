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

interface AppState {
    // Define la forma de tu estado aquí
    [key: string]: any;
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
    // Manejo seguro del sessionStorage
    let initialState: AppState = {};
    try {
        const storedData = sessionStorage.getItem('flextudy');
        initialState = storedData ? JSON.parse(storedData) : {};
    } catch (error) {
        console.error('Error parsing sessionStorage data', error);
        initialState = {};
    }

    const [context, setContext] = useState<AppState>(initialState);
    const [state, dispatch] = useReducer(ContextReducer, initialState);

    // EXAMPLES OF HOW TO USE USEREDUCER/USECONTEXT
    // useEffect(() => {
    //   // dispatch({ type: "ADD", campo: "trolo", payload: "trolo" });
    //   // dispatch({ type: "ADD", campo: "lotro", payload: "lotro" });
    //   // dispatch({ type: "DELETE", campo: "lotro" });
    //   // dispatch({ type: "UPDATE", campo: "trolo", payload: "lotrolotrolotro" });
    // }, []);

    // EXAMPLE HOW TO CONSUME
    //   import { useProvider } from "@/app/context/provider"
    //   const {context, setContext, state, dispatch,} = useProvider()


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