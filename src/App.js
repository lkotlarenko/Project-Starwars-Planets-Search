import React from 'react';
import './App.css';
import AppProvider from './context/Provider';
import PlanetsTable from './components/PlanetsTable';
import Filters from './components/Filters';

function App() {
  return (
    <AppProvider>
      <Filters />
      <PlanetsTable />
    </AppProvider>
  );
}

export default App;
