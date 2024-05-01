'use client'
import React, { useState, useEffect } from 'react';
import '../app/styles.css';

//finds local breweries based on city and state inputted
export default function Brewery() {
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [breweryList, setBreweryList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    //fetching brewery api by city and state
    useEffect(() => {
        const fetchBreweryList = async () => {
            try {
                const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}&by_state=${state}&per_page=10`);
                if (!response.ok) {
                    throw new Error('Failed to fetch information');
                }
                const data = await response.json();
                //filters out any closed breweries and adds rest to brewery list
                const filteredBreweries = data.filter((brewery: { id: number, name: string, brewery_type: string }) => brewery.brewery_type !== 'closed');
                setBreweryList(filteredBreweries);
                setError(null);
            } catch (error) {
                //catching errors
                setError('Error fetching data');
                console.error('Error fetching data: ', error);
            }
        };

        // Fetch data only if brewery list is not empty
        if (city.trim() !== '' && state.trim() !== '') {
            fetchBreweryList();
        } else {
        // reset brewerly list if empty
            setBreweryList([]);
        }
    }, [city, state]);

    return (
        <div>
            <h1 className="title">Brewery Locator - United States</h1>
            <input
                className="input-container"
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            />
            <input
                className="input-container"
                type="text"
                placeholder="Enter State"
                value={state}
                onChange={(e) => setState(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            />
            <ul>
                {breweryList.map((brewery: any) => (
                    <div key={brewery.id}>
                    <h2>{brewery.name}</h2>
                    <p className="brewery-information">{brewery.street}</p>
                    <p className="brewery-information">{brewery.city}, {brewery.state}</p>
                    <p className="link">{brewery.website_url}</p>
                    <p className="brewery-information">Type: {brewery.brewery_type}</p>
                    </div>
                ))}
            </ul>
        </div>
    );
}


