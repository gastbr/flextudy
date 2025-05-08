"use client"

import type React from "react"
import { ContextReducer } from "@/app/context/reducer"
import { createContext, useContext, useEffect, useState, useReducer } from "react"

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

export function ContextProvider({ children }: { children: React.ReactNode }) {
    const [context, setContext] = useState<AppState>({});
    const [state, dispatch] = useReducer(ContextReducer, {});
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
        
        try {
            if (sessionStorage.length) {
                for (let i = 0; i < sessionStorage.length; i++) {
                    const clave = sessionStorage.key(i);
                    const valor = sessionStorage.getItem(clave);
                    
                    // Verifica si el valor es un JSON string (opcional, pero recomendado)
                    let parsedValue;
                    try {
                        parsedValue = JSON.parse(valor); // Intenta parsear el JSON externo
                        // Si el valor parseado es otro JSON string, lo parseamos de nuevo
                        if (typeof parsedValue === 'string') {
                            parsedValue = JSON.parse(parsedValue);
                        }
                    } catch (e) {
                        // Si no es JSON válido, usa el valor original
                        parsedValue = valor;
                    }
                    dispatch({ type: "ADD", campo: clave, payload: parsedValue });
                }
            }
        } catch (error) {
            console.error('Error parsing sessionStorage data', error);
        }
    }, [dispatch]); // Añade dispatch como dependencia si es necesario

    // useEffect(() => {
    //     if (isMounted && state) {
    //         sessionStorage.setItem("flextudy", JSON.stringify(state));
    //     }
    // }, [state, isMounted]);

    const value = {
        context,
        setContext,
        state,
        dispatch,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
}

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