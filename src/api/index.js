const PLANETS_ENDPOINT = 'https://swapi-trybe.herokuapp.com/api/planets/';

const getPlanets = async () => {
  try {
    const response = await fetch(PLANETS_ENDPOINT);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default getPlanets;
