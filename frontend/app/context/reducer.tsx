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

  // EJEMPLOS DE COMO USAR USEREDUCER/USECONTEXT
  // useEffect(() => {
  //   // dispatch({ type: "ADD", campo: "trolo", payload: "trolo" });
  //   // dispatch({ type: "ADD", campo: "lotro", payload: "lotro" });
  //   // dispatch({ type: "DELETE", campo: "lotro" });
  //   // dispatch({ type: "UPDATE", campo: "trolo", payload: "lotrolotrolotro" });
  // }, []);