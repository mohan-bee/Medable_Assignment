import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-6">
            <PeopleManager />
            <ExpenseForm />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <BalanceView />
            <ExpenseList />
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
