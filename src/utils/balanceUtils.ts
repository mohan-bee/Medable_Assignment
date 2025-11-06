import { Expense, SimplifiedDebt } from "../types";

export function calculateBalances(people: string[], expenses: Expense[]) {
  const balances: Record<string, number> = {};

  people.forEach((person) => (balances[person] = 0));

  expenses.forEach((expense) => {
    if(expense.splitType == "equal") {
        const splitCount = expense.splitBetween.length;
        const share = expense.amount / splitCount;
    
        expense.splitBetween.forEach((person) => {
          balances[person] -= share;
        });
    
        balances[expense.paidBy] += expense.amount;
    } 
    
    if (expense.splitType === "custom" && expense.customAmounts) {
        expense.splitBetween.forEach((person) => {
          balances[person] -= expense.customAmounts?.[person] ?? 0
        });

        balances[expense.paidBy] += expense.amount;
    }
  });

  return balances;
}




export function calculateTotalSpending(expenses: Expense[]) {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}


export function simplifyDebts(balances: Record<string, number>) {
  const debts: SimplifiedDebt[] = [];

  const creditors = Object.entries(balances)
    .filter(([, bal]) => bal > 0)
    .map(([name, bal]) => ({ name, amount: bal }));
  const debtors = Object.entries(balances)
    .filter(([, bal]) => bal < 0)
    .map(([name, bal]) => ({ name, amount: -bal }));

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);

    debts.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: parseFloat(pay.toFixed(2)),
    });

    debtors[i].amount -= pay;
    creditors[j].amount -= pay;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return debts;
}
