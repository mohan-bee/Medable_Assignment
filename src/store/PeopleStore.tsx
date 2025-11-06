import React, { createContext, useReducer, useContext, ReactNode } from "react"  


interface PeopleState {
  people: string[]
}

type PeopleAction =
  | { type: "ADD" ;  payload: string }
  | { type: "REMOVE" ;  payload: string }


const initialState: PeopleState = {
  people: [],
}  


function peopleReducer(state: PeopleState, action: PeopleAction): PeopleState {
  switch (action.type) {
    case "ADD": {
      const name = action.payload  
      if (!name || state.people.includes(name)) return state  
      return { ...state, people: [...state.people, name] }  
    }
    case "REMOVE":
      const name = action.payload  
      return {
        ...state,
        people: state.people.filter((person) => person !== name),
      }  
    default:
      return state  
  }
}


const PeopleContext = createContext<{
  state: PeopleState  
  dispatch: React.Dispatch<PeopleAction>  
} | null>(null)  


export const PeopleProvider = ({
  children,
  initialPeople = [],
}: {
  children: ReactNode  
  initialPeople?: string[]  
}) => {
  const [state, dispatch] = useReducer(peopleReducer, {
    people: initialPeople,
  })  

  return (
    <PeopleContext.Provider value={{ state, dispatch }}>
      {children} 
    </PeopleContext.Provider>
  )  
}  


export const usePeople = () => {
  const ctx = useContext(PeopleContext)  
  if (!ctx) throw new Error("people context must be inside the PeopleProvider")  
  return ctx  
}  
