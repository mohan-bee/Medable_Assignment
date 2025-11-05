import { useState } from "react";
import { useExpenses } from "../store/ExpenseStore";
import { CrossIcon, Trash } from "lucide-react";

function ExpenseList() {
  const { state, dispatch } = useExpenses();
  const [openExpenseId, setOpenExpenseId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    dispatch({type: "REMOVE_EXPENSE", payload: id})
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleOverview = (id: number) => {
    setOpenExpenseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        📝 Expense History
      </h2>

      {state.expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div>
          {state.expenses.map((expense) => {
            const isOpen = openExpenseId === expense.id;

            return (
              <div key={expense.id} className="mb-4">
                {/* Summary row */}
                <div
                  onClick={() => toggleOverview(expense.id)}
                  className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
                    isOpen ? "bg-gray-100 border-l-4 border-blue-500" : "bg-gray-50"
                  } rounded-lg border border-gray-200 hover:bg-gray-100`}
                >
                  <div className="flex-1">
                    <h4 className="text-gray-800 mb-1 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                      {expense.description}
                    </h4>
                    <div className="flex gap-4 text-gray-600 text-sm">
                      <span>{formatDate(expense.date)}</span>
                      <span>Paid by {expense.paidBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold text-gray-700">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      className={`text-gray-600 transform transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      aria-label="Toggle Overview"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Expanded Overview */}
                {isOpen && (
                  <div className="mt-2 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold mb-3">
                      Split Details ({expense.splitType})
                    </h2>

                    <div className="space-y-2">
                      {expense.splitType === "equal" &&
                        expense.splitBetween
                          .filter((p) => p !== expense.paidBy)
                          .map((p) => (
                            <div
                              key={p}
                              className="flex justify-between items-center bg-gray-50 rounded-md px-4 py-2"
                            >
                              <span className="font-medium text-gray-800">{p}</span>
                              <span className="text-gray-600">
                                owes{" "}
                                <span className="text-red-500 font-semibold">
                                  $
                                  {(expense.amount / expense.splitBetween.length).toFixed(
                                    2
                                  )}
                                </span>
                              </span>
                            </div>
                          ))}

                      {expense.splitType === "custom" &&
                        Object.entries(expense.customAmounts ?? {})
                          .filter(([p]) => p !== expense.paidBy)
                          .map(([p, amt]) => (
                            <div
                              key={p}
                              className="flex justify-between items-center bg-gray-50 rounded-md px-4 py-2"
                            >
                              <span className="font-medium text-gray-800">{p}</span>
                              <span className="text-gray-600">
                                owes{" "}
                                <span className="text-red-500 font-semibold">
                                  ${Number(amt).toFixed(2)}
                                </span>
                              </span>
                            </div>
                          ))}
                    </div>

                    <button 
                    onClick={() => handleDelete(expense.id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md px-4 py-2 flex items-center gap-2">
                      <Trash size={17}/>
                      Delete Expense
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700">
        <p>
          Total Expenses: <strong>{state.expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
