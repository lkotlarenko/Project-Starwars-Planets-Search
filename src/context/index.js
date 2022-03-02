import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

const Provider = ({ children }) => {
  const value = {};
  return <AppContext.Provider value={ value }>{children}</AppContext.Provider>;
};

Provider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default Provider;
