import { useState } from "react";
import { useExpenses } from "../store/ExpenseStore";
import { usePeople } from "../store/PeopleStore";
import { Expense } from "../types";

function ExpenseForm() {
  const { state: peopleState } = usePeople();
  const { dispatch } = useExpenses();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");


  const toggleSplitPerson = (person: string) => {
    setSplitBetween((prev) => {
      if (prev.includes(person)) {
        const updated = prev.filter((p) => p !== person);
        const newCustom = { ...customAmounts };
        delete newCustom[person];
        setCustomAmounts(newCustom);
        return updated;
      } else {
        return [...prev, person];
      }
    });
  };


  const addCustomExpense = (person: string, amount: number) => {
    setCustomAmounts((prev) => ({ ...prev, [person]: amount || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || !paidBy || splitBetween.length === 0) {
      setMessage("⚠️ Please fill out all fields before adding an expense.");
      return;
    }

    const totalAmount = parseFloat(amount);

    let payload: Omit<Expense, "id">;

    if (splitType === "equal") {
      payload = {
        description: description.trim(),
        amount: totalAmount,
        paidBy,
        date,
        splitBetween,
        splitType: "equal",
      };
    } else {
      const totalCustom = Object.entries(customAmounts)
        .filter(([person]) => splitBetween.includes(person))
        .reduce((sum, [, val]) => sum + (val || 0), 0);

      if (Math.abs(totalCustom - totalAmount) > 0.01) {
        setMessage("⚠️ Custom amounts must total exactly the expense amount.");
        return;
      }

      payload = {
        description: description.trim(),
        amount: totalAmount,
        paidBy,
        date,
        splitBetween,
        splitType: "custom",
        customAmounts,
      };
    }


    dispatch({ type: "ADD_EXPENSE", payload });


    setDescription("");
    setAmount("");
    setDate("");
    setPaidBy("");
    setSplitBetween([]);
    setCustomAmounts({});
    setMessage("✅ Expense added successfully!");
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-gray-700 font-medium text-sm">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 mb-4">
            <label htmlFor="amount" className="block mb-1 text-gray-700 font-medium text-sm">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label htmlFor="date" className="block mb-1 text-gray-700 font-medium text-sm">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="paidBy" className="block mb-1 text-gray-700 font-medium text-sm">
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Select person...</option>
            {peopleState.people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">Split Type</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="equal"
                name="splitType"
                checked={splitType === "equal"}
                onChange={() => setSplitType("equal")}
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="custom"
                name="splitType"
                checked={splitType === "custom"}
                onChange={() => setSplitType("custom")}
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">Split Between</label>
          <div className="flex flex-col gap-2">
            {peopleState.people.map((person) => (
              <div key={person} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitBetween.includes(person)}
                    onChange={() => toggleSplitPerson(person)}
                  />
                  <span>{person}</span>
                </label>

                {splitType === "custom" && splitBetween.includes(person) && (
                  <input
                    type="number"
                    value={customAmounts[person] || ""}
                    onChange={(e) => addCustomExpense(person, parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600"
        >
          Add Expense
        </button>

        {message && (
          <p
            className={`mt-3 text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ExpenseForm;
