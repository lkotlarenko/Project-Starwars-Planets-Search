import React, { useContext } from 'react';
import './App.css';
import PlanetsTable from './components/PlanetsTable';
import { AppContext } from './context';

function App() {
  const { planets: { results } } = useContext(AppContext);
  return (
    <PlanetsTable data={ results } />
  );
}

export default App;
