import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import App from './App';
import testData from './testData';

const ROW_ROLE_SELECTOR = 'row';
const COLUMN_ROLE_SELECTOR = 'columnheader';
const INPUT_FILTER_NAME_SELECTOR = 'name-filter';
const COLUMN_FILTER_SELECTOR = 'column-filter';
const COMPARISON_FILTER_SELECTOR = 'comparison-filter';
const VALUE_FILTER_SELECTOR = 'value-filter';
const BUTTON_FILTER_SELECTOR = 'button-filter';
const BUTTON_REMOVE_ALL = 'button-remove-filters';
const REMOVE_FILTER_SELECTOR = 'filter';
const SORT_COLUMN_SELECTOR = 'column-sort';
const SORT_ORDER_ASC_SELECTOR = 'column-sort-input-asc';
const SORT_ORDER_DESC_SELECTOR = 'column-sort-input-desc';
const SORT_APPLY_SELECTOR = 'column-sort-button';
const PLANET_NAME_SELECTOR = 'planet-name';

const ROWS_TOTAL = 11;
const COLUMNS_TOTAL = 13;
const NUMERIC_FILTERED_ROWS = 8;
const DOUBLE_NUMERIC_FILTERED_ROWS = 3;
const TRIPLE_NUMERIC_FILTERED_ROWS = 2;

const mockFetch = () => {
  jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(testData),
    }));
};

describe('1 - Faça uma requisição para o endpoint `/planets` da API de Star Wars e preencha uma tabela com os dados retornados, com exceção dos da coluna `residents`', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('Realize uma requisição para a API', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('Preencha a tabela com os dados retornados', async () => {
    await act(async () => {
      render(<App />);
    });
    const planets = testData.results;
    for (const planetIndex in planets) {
      const name = await screen.findByText(planets[planetIndex].name);
      const rotationPeriod = await screen.findAllByText(planets[planetIndex].rotation_period);
      const orbitalPeriod = await screen.findAllByText(planets[planetIndex].orbital_period);
      const diameter = await screen.findAllByText(planets[planetIndex].diameter);
      const climate = await screen.findAllByText(planets[planetIndex].climate);
      const gravity = await screen.findAllByText(planets[planetIndex].gravity);
      const terrain = await screen.findAllByText(planets[planetIndex].terrain);
      const surfaceWater = await screen.findAllByText(planets[planetIndex].surface_water);
      const population = await screen.findAllByText(planets[planetIndex].population);

      expect(name).toBeInTheDocument();
      expect(rotationPeriod.length).toBeGreaterThanOrEqual(1);
      expect(orbitalPeriod.length).toBeGreaterThanOrEqual(1);
      expect(diameter.length).toBeGreaterThanOrEqual(1);
      expect(climate.length).toBeGreaterThanOrEqual(1);
      expect(gravity.length).toBeGreaterThanOrEqual(1);
      expect(terrain.length).toBeGreaterThanOrEqual(1);
      expect(surfaceWater.length).toBeGreaterThanOrEqual(1);
      expect(population.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('Verifique se a tabela tem 13 colunas', async () => {
    await act(async () => {
      render(<App />);
    });
    // a requisição (mock) retorna 14 chaves em cada planeta, mas a chave `residents` não deve ser exibida totalizando 13 colunas
    expect(await screen.findAllByRole(COLUMN_ROLE_SELECTOR)).toHaveLength(COLUMNS_TOTAL);
  });

  it('Verifique se a tabela tem uma linha para cada planeta retornado', async () => {
    await act(async () => {
      render(<App />);
    });
    // a requisição (mock) retorna 10 planetas, somando com mais um linha do header totalizando 11 linhas
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);
  });
});

describe('2 - Filtre a tabela através de um texto, inserido num *campo de texto*, exibindo somente os planetas cujos nomes incluam o texto digitado', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  const ROWS_WITH_LETTER_O = 8;
  const ROWS_WITH_LETTERS_OO = 3;

  it('Renderize o campo de texto para o filtro de nomes', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR)).toBeInTheDocument();
  });

  it('Filtre os planetas que possuem a letra "o" no nome', async () => {
    await act(async () => {
      render(<App />);
    });

    const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
    fireEvent.change(input, { target: { value: 'o' } });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_WITH_LETTER_O);
    const planetNames = ['Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine'];
    for (const planetName of planetNames) {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    }
  });

  it('Filtre planetas que possuem a letra "oo" no nome', async () => {
    await act(async () => {
      render(<App />);
    });

    const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
    fireEvent.change(input, { target: { value: 'oo' } });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_WITH_LETTERS_OO);
    const planetNames = ['Naboo', 'Tatooine'];
    for (const planetName of planetNames) {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    }
  });

  it('Faça vários filtros em sequência', async () => {
    await act(async () => {
      render(<App />);
    });

    const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
    fireEvent.change(input, { target: { value: 'o' } });
    let planetNames = [];
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_WITH_LETTER_O);
    planetNames = ['Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine'];
    for (const planetName of planetNames) {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    }

    await act(async () => {
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: 'oo' } });
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_WITH_LETTERS_OO);
    planetNames = ['Naboo', 'Tatooine'];
    for (const planetName of planetNames) {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    }

    await act(async () => {
      const input = await screen.findByTestId(INPUT_FILTER_NAME_SELECTOR);
      fireEvent.change(input, { target: { value: '' } });
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);
    planetNames = ['Alderaan', 'Bespin', 'Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine', 'Yavin IV'];
    for (const planetName of planetNames) {
      expect(await screen.findByText(planetName)).toBeInTheDocument();
    }
  });
});

describe('3 - Crie um filtro para valores numéricos', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('Renderize o filtro de coluna', async () => {
    await act(async () => {
      render(<App />);
    });

    const column = await screen.findByTestId(COLUMN_FILTER_SELECTOR);
    expect(column).toHaveProperty('nodeName', 'SELECT');
    const columns = ['population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water'];
    const foundColumnFilter = Array.from(column.children).map((child) => {
      expect(child).toHaveProperty('nodeName', 'OPTION');
      return child.innerHTML;
    });
    expect(foundColumnFilter).toEqual(expect.arrayContaining(columns));
  });

  it('Renderize o filtro de comparação', async () => {
    await act(async () => {
      render(<App />);
    });

    const column = await screen.findByTestId(COMPARISON_FILTER_SELECTOR);
    expect(column).toHaveProperty('nodeName', 'SELECT');
    const columns = ['maior que', 'igual a', 'menor que'];
    const foundComparisonFilter = Array.from(column.children).map((child) => {
      expect(child).toHaveProperty('nodeName', 'OPTION');
      return child.innerHTML;
    });
    expect(foundComparisonFilter).toEqual(expect.arrayContaining(columns));
  });

  it('Renderize o campo para o valor do filtro', async () => {
    await act(async () => {
      render(<App />);
    });

    const value = await screen.findByTestId(VALUE_FILTER_SELECTOR);
    expect(value).toHaveProperty('nodeName', 'INPUT');
    expect(value).toHaveAttribute('type', 'number');
  });

  it('Renderize o botão para executar a filtragem', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(await screen.findByTestId(BUTTON_FILTER_SELECTOR)).toHaveProperty('nodeName', 'BUTTON');
  });

  it('Verifica valores iniciais de cada campo', async () => {
    await act(async () => {
      render(<App />);
    });

    const column = await screen.findByTestId(COLUMN_FILTER_SELECTOR);
    const comparison = await screen.findByTestId(COMPARISON_FILTER_SELECTOR);
    const value = await screen.findByTestId(VALUE_FILTER_SELECTOR);

    expect(column).toHaveValue('population');
    expect(column.firstChild).toHaveTextContent('population');

    expect(comparison).toHaveValue('maior que');
    expect(comparison.firstChild).toHaveTextContent('maior que');
    expect(value).toHaveValue(0);
  });

  it('Filtre utilizando apenas o botão de filtrar', async () => {
    await act(async () => {
      render(<App />);
    });

    const DEFAULT_FILTERED_ROWS = 9;

    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(DEFAULT_FILTERED_ROWS);
  });

  it('Filtre utilizando a comparação "menor que"', async () => {
    await act(async () => {
      render(<App />);
    });

    const LESS_FILTERED_ROWS = 7;

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'surface_water' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'menor que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '40' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(LESS_FILTERED_ROWS);
  });

  it('Filtre utilizando a comparação "maior que"', async () => {
    await act(async () => {
      render(<App />);
    });

    const GREATER_FILTERED_ROWS = 8;

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(GREATER_FILTERED_ROWS);
  });

  it('Filtre utilizando a comparação "igual a"', async () => {
    await act(async () => {
      render(<App />);
    });

    const EQUALS_FILTERED_ROWS = 2;

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'igual a' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '200000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(EQUALS_FILTERED_ROWS);
  });
});

describe('4 - Implemente múltiplos filtros numéricos', () => {
  it('Adicione dois filtros e verifique se a tabela foi atualizada com as informações filtradas', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'menor que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '1000000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(DOUBLE_NUMERIC_FILTERED_ROWS);
  });

  it('Adicione três filtros e verifique se a tabela foi atualizada com as informações filtradas', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'menor que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '1000000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(DOUBLE_NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'rotation_period' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'igual a' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '23' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(TRIPLE_NUMERIC_FILTERED_ROWS);
  });
});

describe('5 - Não utilize filtros repetidos', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('Filtre por população e o remove das opções', async () => {
    await act(async () => {
      render(<App />);
    });

    const OPTIONS_WITHOUT_REMOVED = 4;

    let column = null;
    let foundColumnFilter = null;

    column = await screen.findByTestId(COLUMN_FILTER_SELECTOR);
    expect(column).toHaveProperty('nodeName', 'SELECT');
    foundColumnFilter = Array.from(column.children).map((child) => {
      expect(child).toHaveProperty('nodeName', 'OPTION');
      return child.innerHTML;
    });
    expect(foundColumnFilter).toEqual(expect.arrayContaining(['population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water']));

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    column = await screen.findByTestId(COLUMN_FILTER_SELECTOR);
    expect(column).toHaveProperty('nodeName', 'SELECT');
    foundColumnFilter = Array.from(column.children).map((child) => {
      expect(child).toHaveProperty('nodeName', 'OPTION');
      return child.innerHTML;
    });
    expect(foundColumnFilter).toEqual(expect.arrayContaining(['orbital_period', 'diameter', 'rotation_period', 'surface_water']));
    expect(foundColumnFilter).toHaveLength(OPTIONS_WITHOUT_REMOVED);
  });
});

describe('6 - Apague um filtro de valor numérico ao clicar no ícone de X de um dos filtros e apague todas filtragens numéricas simultaneamente ao clicar em outro botão de Remover todas filtragens', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  const removeFilter = async (index = 0) => {
    const filters = await screen.findAllByTestId(REMOVE_FILTER_SELECTOR);
    fireEvent.click(filters[index].querySelector('button'));
  };

  it('Adicione um filtro e verifique se a tabela foi atualizada com as informações filtradas, depois remova o filtro e verifique se os valores da tabela voltaram ao original', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    await removeFilter();

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);
  });

  it('Adicione dois filtros e verifique se a tabela foi atualizada com as informações filtradas, depois remova os filtros e verifique se os valores da tabela voltaram ao original', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'menor que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '1000000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(DOUBLE_NUMERIC_FILTERED_ROWS);

    await removeFilter(1);

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    await removeFilter();

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);
  });

  it('Adicione três filtros e clique no botão Remover Filtragens, todos os filtros deverão ser removidos', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'maior que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '8900' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'population' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'menor que' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '1000000' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(DOUBLE_NUMERIC_FILTERED_ROWS);

    fireEvent.change(await screen.findByTestId(COLUMN_FILTER_SELECTOR), { target: { value: 'rotation_period' } });
    fireEvent.change(await screen.findByTestId(COMPARISON_FILTER_SELECTOR), { target: { value: 'igual a' } });
    fireEvent.change(await screen.findByTestId(VALUE_FILTER_SELECTOR), { target: { value: '23' } });
    fireEvent.click(await screen.findByTestId(BUTTON_FILTER_SELECTOR));
    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(TRIPLE_NUMERIC_FILTERED_ROWS);

    fireEvent.click(await screen.findByTestId(BUTTON_REMOVE_ALL));

    expect(await screen.findAllByRole(ROW_ROLE_SELECTOR)).toHaveLength(ROWS_TOTAL);
  });
});

describe('7 - Ordene as colunas de forma ascendente ou descendente', () => {
  beforeAll(mockFetch);
  beforeEach(cleanup);

  it('Verifique a ordenação inicial', async () => {
    await act(async () => {
      render(<App />);
    });
    const expected = ['Alderaan', 'Bespin', 'Coruscant', 'Dagobah', 'Endor', 'Hoth', 'Kamino', 'Naboo', 'Tatooine', 'Yavin IV'];
    const planets = await screen.findAllByTestId(PLANET_NAME_SELECTOR);
    const actual = planets.map((planet) => planet.innerHTML);
    expect(actual).toEqual(expected);
  });

  it('Ordene os planetas do maior período orbital para o menor período orbital', async () => {
    await act(async () => {
      render(<App />);
    });
    fireEvent.change(await screen.findByTestId(SORT_COLUMN_SELECTOR), { target: { value: 'orbital_period' } });
    fireEvent.click(await screen.findByTestId(SORT_ORDER_DESC_SELECTOR));
    fireEvent.click(await screen.findByTestId(SORT_APPLY_SELECTOR));
    const expected = ['Bespin', 'Yavin IV', 'Hoth', 'Kamino', 'Endor', 'Coruscant', 'Alderaan', 'Dagobah', 'Naboo', 'Tatooine'];
    const planets = await screen.findAllByTestId(PLANET_NAME_SELECTOR);
    const actual = planets.map((planet) => planet.innerHTML);
    expect(actual).toEqual(expected);
  });

  it('Ordene os planetas do menor diâmetro para o maior diâmetro', async () => {
    await act(async () => {
      render(<App />);
    });
    fireEvent.change(await screen.findByTestId(SORT_COLUMN_SELECTOR), { target: { value: 'diameter' } });
    fireEvent.click(await screen.findByTestId(SORT_ORDER_ASC_SELECTOR));
    fireEvent.click(await screen.findByTestId(SORT_APPLY_SELECTOR));
    const expected = ['Endor', 'Hoth', 'Dagobah', 'Yavin IV', 'Tatooine', 'Naboo', 'Coruscant', 'Alderaan', 'Kamino', 'Bespin'];
    const planets = await screen.findAllByTestId(PLANET_NAME_SELECTOR);
    const actual = planets.map((planet) => planet.innerHTML);
    expect(actual).toEqual(expected);
  });

  it('Ordene os planetas do mais populoso para o menos populoso', async () => {
    await act(async () => {
      render(<App />);
    });
    fireEvent.change(await screen.findByTestId(SORT_COLUMN_SELECTOR), { target: { value: 'population' } });
    fireEvent.click(await screen.findByTestId(SORT_ORDER_DESC_SELECTOR));
    fireEvent.click(await screen.findByTestId(SORT_APPLY_SELECTOR));
    const planets = await screen.findAllByTestId(PLANET_NAME_SELECTOR);

    const expectedPlanetsWithNumericValues = ['Coruscant', 'Naboo', 'Alderaan', 'Kamino', 'Endor', 'Bespin', 'Tatooine', 'Yavin IV'];
    const actualPlanetsWithNumericValues = planets.map(planet => planet.innerHTML).slice(0,8);
    expect(actualPlanetsWithNumericValues).toEqual(expectedPlanetsWithNumericValues);

    const expectedPlanetsWithUnknownValues = ['Dagobah', 'Hoth'];
    const actualPlanetsWithUnknownValues = planets.map(planet => planet.innerHTML).slice(8, 10);
    expect(actualPlanetsWithUnknownValues).toEqual(expect.arrayContaining(expectedPlanetsWithUnknownValues));
  });
});
