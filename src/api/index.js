const PLANETS_ENDPOINT = 'https://swapi-trybe.herokuapp.com/api/planets/';

const getPlanets = async (dispatchPlanets, dispatchLoading, dispatchInitialPlanets) => {
  dispatchLoading(true);
  try {
    const response = await fetch(PLANETS_ENDPOINT);
    const data = await response.json();
    dispatchPlanets(data.results);
    dispatchLoading(false);
    dispatchInitialPlanets(data.results);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default getPlanets;
