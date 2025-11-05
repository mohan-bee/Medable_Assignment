import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { Expense } from "../types";

// ----------------------
// TYPES
// ----------------------

interface ExpenseState {
  expenses: Expense[];
}

type ExpenseAction =
  | { type: "ADD_EXPENSE"; payload: Omit<Expense, "id"> }
  | { type: "REMOVE_EXPENSE"; payload: number };


const initialState: ExpenseState = {
  expenses: [],
};


function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case "ADD_EXPENSE": {
        
      const newExpense: Expense = {
        ...action.payload,
        id: state.expenses.length + 1,
      };

      return { ...state, expenses: [...state.expenses, newExpense] };
    }

    case "REMOVE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };

    default:
      return state;
  }
}


const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
} | null>(null);

// ----------------------
// PROVIDER
// ----------------------

export const ExpenseProvider = ({
  children,
  initialExpenses = [],
}: {
  children: ReactNode;
  initialExpenses?: Expense[];
}) => {
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: initialExpenses,
  });

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
};


export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
  return ctx;
};
