'use client';

export const ContextReducer = (state:any, action:any) => {
    switch (action.type) {

        case "ADD":
            return {
                ...state,
                [action.campo]: action.payload,
            };
        
        case "UPDATE":
            return {
                ...state,
                [action.campo]: action.payload,
            };

        case "DELETE":
            const newState = { ...state }; 
            delete newState[action.campo];
            return newState;
        
        default:
            return state;
    }
}