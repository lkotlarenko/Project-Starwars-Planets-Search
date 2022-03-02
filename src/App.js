import React, { useEffect, useState } from 'react';
import './App.css';
import PlanetsTable from './components/PlanetsTable';
import getPlanets from './api';

function App() {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchPlanets = async () => {
    await getPlanets(setPlanets, setLoading);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    <>
      <h1>Planets</h1>
      { !isLoading && <PlanetsTable data={ planets } /> }
    </>
  );
}

export default App;
