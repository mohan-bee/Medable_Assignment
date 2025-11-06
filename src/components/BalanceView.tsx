import { usePeople } from "../store/PeopleStore";
import { useExpenses } from "../store/ExpenseStore";
import {
  calculateBalances,
  calculateTotalSpending,
  simplifyDebts,
} from "../utils/balanceUtils";

function BalanceView() {
  const { state: peopleState } = usePeople();
  const { state: expenseState } = useExpenses();

  const balances = calculateBalances(peopleState.people, expenseState.expenses);
  const totalSpending = calculateTotalSpending(expenseState.expenses);
  const simplifiedDebts = simplifyDebts(balances);

  const allSettled = Object.values(balances).every(
    (amount) => Math.abs(amount) < 0.01
  );

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-6">
        <span>Total Group Spending:</span>
        <strong className="text-2xl">${totalSpending.toFixed(2)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {peopleState.people.map((person) => {
          const amount = balances[person] ?? 0;
          const isOwed = amount > 0;
          const owes = amount < 0;

          return (
            <div
              key={person}
              
              className={`flex justify-between items-center px-3 py-3 mb-2 rounded-md border transition-all hover:translate-x-1 ${
                isOwed
                  ? "bg-green-50 border-green-300"
                  : owes
                  ? "bg-red-50 border-red-300"
                  : "bg-gray-100 border-gray-300"
              }`} 
            >
              <span className="font-medium text-gray-800">{person}</span>
              <span
                className={`font-semibold ${
                  isOwed
                    ? "text-green-600"
                    : owes
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {isOwed
                  ? `Owed $${amount.toFixed(2)}`
                  : owes
                  ? `Owes $${Math.abs(amount).toFixed(2)}`
                  : "Settled up"}
              </span>
            </div>
          );
        })}
      </div>

      {!allSettled && simplifiedDebts.length > 0 && (
        <div className="mt-6 p-4 border border-blue-200 rounded-lg">
          <h3 className="text-blue-700 font-semibold mb-2">💡 Suggested Settlements</h3>
          <p className="text-xs mb-5 text-gray-500">Minimum transactions to settle all debts</p>
          {simplifiedDebts.map((d, idx) => (
            <p key={idx} className="text-blue-800 text-sm">
              <div 
              className="flex justify-between text-md font-bold items-center px-3 py-3 mb-2 rounded-md border transition-all hover:translate-x-1"
              >
                  <div>
                    <span className="text-red-500">{d.from}</span> → <span className="text-green-500">{d.to} </span>
                  </div>
                  <strong>${d.amount.toFixed(2)}</strong>
              </div>
            </p>
          ))}
        </div>
      )}

      {allSettled && (
        <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
          <p>All balances are settled!</p>
        </div>
      )}
    </div>
  );
}

export default BalanceView;
