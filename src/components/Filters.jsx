import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const Filters = () => {
  const {
    setSearch,
  } = useContext(AppContext);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        id="search"
        data-testid="name-filter"
        placeholder="Planet Name"
        onChange={ handleSearch }
      />
    </div>
  );
};

export default Filters;
