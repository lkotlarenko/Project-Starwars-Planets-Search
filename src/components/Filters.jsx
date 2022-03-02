import React, { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';

const Filters = () => {
  const {
    setPlanets,
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
  } = useContext(AppContext);
  const comparators = ['maior que', 'menor que', 'igual a'];

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilter = () => {
    changeTypes(types.filter((type) => type !== filterType));
    const newFilter = { filterType, filterComparator, filterValue };
    setFiltersList([...filtersList, newFilter]);
  };

  useEffect(() => {
    const filterPlanets = () => {
      filtersList.forEach((filter) => {
        setPlanets((prevState) => prevState.filter((planet) => {
          switch (filter.filterComparator) {
          case 'maior que':
            return Number(planet[filter.filterType]) > filter.filterValue;
          case 'menor que':
            return Number(planet[filter.filterType]) < filter.filterValue;
          default:
            return Number(planet[filter.filterType]) === Number(filter.filterValue);
          }
        }));
      });
    };
    filterPlanets();
  }, [filtersList, setPlanets]);

  const ACTIVE_FILTERS = (
    filtersList.map((filter) => (
      <div key={ filter.filterType }>
        <h4 data-testid="filter">
          {`${filter.filterType} ${filter.filterComparator} ${filter.filterValue}`}
        </h4>
      </div>
    ))
  );

  return (
    <div>
      <h2>Filters</h2>
      <label htmlFor="name-filter">
        <h3>name</h3>
        <input
          type="text"
          id="name-filter"
          data-testid="name-filter"
          placeholder="Planet Name"
          onChange={ handleSearch }
        />
      </label>
      <label htmlFor="column-filter">
        <h3>type</h3>
        <select
          id="column-filter"
          data-testid="column-filter"
          onChange={ (event) => setFilterType(event.target.value) }
        >
          {types.map((type) => (
            <option value={ type } key={ type }>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="comparison-filter">
        <h3>name</h3>
        <select
          id="comparison-filter"
          data-testid="comparison-filter"
          onChange={ (event) => setComparator(event.target.value) }
        >
          { comparators.map((comp) => (
            <option key={ comp } value={ comp }>{comp}</option>
          ))}
        </select>
      </label>
      <label htmlFor="value-filter">
        <h3>value</h3>
        <input
          min="0"
          type="number"
          id="value-filter"
          data-testid="value-filter"
          placeholder="400"
          value={ filterValue }
          onChange={ (event) => setFilterValue(event.target.value) }
        />
      </label>
      <button
        type="button"
        data-testid="button-filter"
        onClick={ handleFilter }
      >
        Filter!
      </button>

      { filtersList && ACTIVE_FILTERS }
    </div>
  );
};

export default Filters;
