import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getPlanets from '../api/index';
import AppContext from './AppContext';

const AppProvider = ({ children }) => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [INITIAL_PLANETS, setInitialPlanets] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('population');
  const [types, changeTypes] = useState(
    ['population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water'],
  );
  const [filterComparator, setComparator] = useState('maior que');
  const [filterValue, setFilterValue] = useState(0);
  const [filtersList, setFiltersList] = useState([]);

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
    filterType,
    setFilterType,
    types,
    changeTypes,
    filterComparator,
    setComparator,
    filterValue,
    setFilterValue,
    filtersList,
    setFiltersList,
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
