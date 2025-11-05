import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PeopleProvider } from './store/PeopleStore.tsx';
import { ExpenseProvider } from './store/ExpenseStore.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExpenseProvider>
    <PeopleProvider initialPeople={['Alice', 'Bob']}>
    <App />
    </PeopleProvider>
    </ExpenseProvider>
  </StrictMode>,
);
