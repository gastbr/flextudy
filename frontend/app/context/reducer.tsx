'use client';

export const ContextReducer = (state: any, action: any) => {
    switch (action.type) {

        case "ADD":
        case "UPDATE":
            return {
                flextudy: {
                    ...state,
                    [action.campo]: action.payload,
                },
            }

        case "DELETE":
            const newFlextudy = { ...state.flextudy }
            delete newFlextudy[action.campo]
            return {
                ...state,
                flextudy: newFlextudy,
            }

        default:
            return state
    }
}

