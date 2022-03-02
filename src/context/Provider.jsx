import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getPlanets from '../api/index';
import AppContext from './AppContext';

const AppProvider = ({ children }) => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [INITIAL_PLANETS, setInitialPlanets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPlanets = async () => {
      await getPlanets(setPlanets, setLoading, setInitialPlanets);
    };
    fetchPlanets();
  }, [setInitialPlanets, setLoading, setPlanets]);

  const context = {
    planets,
    setPlanets,
    isLoading,
    setLoading,
    INITIAL_PLANETS,
    setInitialPlanets,
    search,
    setSearch,
  };

  return (
    <AppContext.Provider value={ context }>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default AppProvider;
