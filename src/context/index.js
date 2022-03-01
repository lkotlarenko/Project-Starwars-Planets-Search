import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getPlanets from '../api';

export const AppContext = createContext();

const Provider = ({ children }) => {
  const [planets, setPlanets] = useState([]);

  const fetchPlanets = async () => {
    const response = await getPlanets();
    setPlanets(response);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const value = { planets };
  return <AppContext.Provider value={ value }>{children}</AppContext.Provider>;
};

Provider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default Provider;
