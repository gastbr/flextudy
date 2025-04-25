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
        
        
        

        // case "AGREGAR_EVENTOS":
        //     return {
        //         ...state,
        //         eventos: [action.payload],
        //     };

        // case "AGREGAR_ASOCIACIONES":
        //     return {
        //         ...state,
        //         asociaciones: [action.payload],
        //     };

        // case "EJEMPLO_BORRAR_PREGUNTA":
        //     return {
        //         ...state,
        //         questions: state.questions.filter(question => question.id !== action.payload)
        //     }
        // case "EJEMPLO":
        //     return {
        //         ...state,
        //         questions: [...state.questions, { ...action.payload, id: state.nextId }],
        //         nextId: state.nextId + 1
        //     };
        default:
            return state;
    }
}