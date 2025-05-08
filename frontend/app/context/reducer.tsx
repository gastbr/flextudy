'use client';

export const ContextReducer = (state: any, action: any) => {
    switch (action.type) {

        case "ADD":
        case "UPDATE":
            sessionStorage.setItem(`${[action.campo]}`, JSON.stringify(action.payload));
            return {
                    ...state,
                    [action.campo]: action.payload,
            }

        case "DELETE":
            delete state[action.campo]
            return state

        default:
            return state
    }
}

