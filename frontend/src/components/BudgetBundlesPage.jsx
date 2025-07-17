import React from 'react'
import { useState } from 'react'
import Bundle from './Bundle';

export default function BudgetBundlesPage() {
    const [items, setItems] = useState([null, null]);
    const [budget, setBudget] = useState(null);
    const [bundles, setBundles] = useState({});

    function ChangeItem(e, index) {
        const value = e.target.value;
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    }

    function AddItem(e) {
        e.preventDefault();
        setItems([...items, null]);
    }

    async function FindBundles(e) {
        e.preventDefault();
        const filteredItems = items.filter(item => item != null && item != '');
        if (filteredItems.length < 2) {
            alert("Please add more items.");
            return;
        }
        if (budget == null) {
            alert("Invalid budget request.");
            return;
        }
        const url = new URL(import.meta.env.VITE_URL + '/user/bundles');
        const params = new URLSearchParams();
        for (let i = 0; i < filteredItems.length; i++) {
            params.append('item', filteredItems[i]);
        }
        params.append('budget', budget);
        const queryString = params.toString();
        const fetchUrl = `${url}?${queryString}`;
        const response = await fetch(fetchUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        if (response.ok) {
            setBundles(result);
        }
        else{
            alert(result.message);
        }
    }

    return (
        <div className='page'>
            <h2>Budget Bundles</h2>
            <form onSubmit={FindBundles}>
                <p>Add Items</p>
                {items.map((item, index) => <input key={index} className='bundle-input' type="text" value={item ? item : ""} onChange={(e) => ChangeItem(e,index)}/>)}
                <button type="button" onClick={AddItem}>Add Item</button>
                <p>Specify Budget</p>
                <input type="text" value={budget ? budget : ""} onChange={(e) => setBudget(e.target.value)} required/>
                <button type="submit">Submit</button>
            </form>
            <div className='bundles'>
                <p>Cheapest Bundle:</p>
                {bundles.cheapestBundle && <Bundle bundleInfo={bundles.cheapestBundle}/>}
                <p>Recommended Bundle:</p>
                {bundles.recommendedBundle && <Bundle bundleInfo={bundles.recommendedBundle.slice(2)}/>}
            </div>
        </div>
    )
}
