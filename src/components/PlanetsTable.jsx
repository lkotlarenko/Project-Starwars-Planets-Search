import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const PlanetsTable = () => {
  const {
    planets,
    search,
    isLoading,
  } = useContext(AppContext);

  if (!isLoading) {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          { planets && planets.filter(
            (planet) => planet.name.toLowerCase().includes(search),
          ).map(
            ({
              name, rotation_period: rotationPeriod, orbital_period: orbitalPeriod,
              diameter, climate, gravity, terrain, surface_water: surfaceWater,
              population, films, created, edited, url,
            }) => (
              <tr key={ created }>
                <td>{name}</td>
                <td>{rotationPeriod}</td>
                <td>{orbitalPeriod}</td>
                <td>{diameter}</td>
                <td>{climate}</td>
                <td>{gravity}</td>
                <td>{terrain}</td>
                <td>{surfaceWater}</td>
                <td>{population}</td>
                <td>{films}</td>
                <td>{created}</td>
                <td>{edited}</td>
                <td>{url}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    );
  }
  return <h2>Loading...</h2>;
};

export default PlanetsTable;
