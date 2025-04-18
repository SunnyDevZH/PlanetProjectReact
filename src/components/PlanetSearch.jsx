import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPlanet } from '../redux/planetsSlice';

const PlanetSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Funktion, um Planeten aus der API zu suchen
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      try {
        setIsLoading(true);
        const response = await fetch(`https://swapi.dev/api/planets/?search=${term}`);
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Planeten');
        }
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error('Fehler bei der API-Suche:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Funktion, um einen Planeten hinzuzufügen
  const handleAddPlanet = (planet) => {
    const formattedPlanet = {
      name: planet.name,
      climate: planet.climate || 'Unbekannt',
      terrain: planet.terrain || 'Unbekannt',
      population: planet.population !== 'unknown' ? planet.population : 'Unbekannt',
    };
    dispatch(addPlanet(formattedPlanet)); // Planet wird dem Redux-Store hinzugefügt
  };

  return (
    <div>
      <h2>Die Galaxie durchsuchen</h2>
      <input
        type="text"
        placeholder="Planeten suchen..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isLoading ? (
        <p>Die Galaxie wird durchsucht...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Klima</th>
              <th>Terrain</th>
              <th>Population</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((planet) => (
              <tr key={planet.name}>
                <td>{planet.name}</td>
                <td>{planet.climate}</td>
                <td>{planet.terrain}</td>
                <td>{planet.population}</td>
                <td>
                  <button onClick={() => handleAddPlanet(planet)}>Hinzufügen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlanetSearch;