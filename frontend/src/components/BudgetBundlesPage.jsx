import React from 'react'
import { useState } from 'react'
import Bundle from './Bundle';
import '../components-css/BudgetBundlesPage.css'

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

    function RemoveItem(e) {
        e.preventDefault();
        const newItems = [...items];
        newItems.pop();
        setItems(newItems);
    }

    function ClearBundles(e) {
        e.preventDefault();
        setBundles({});
        setItems([null, null]);
        setBudget(null);
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
            <div className='bundle-page'>
                <div>
                    <h2>Budget Bundles</h2>
                    <form onSubmit={FindBundles}>
                        <p>Add Items</p>
                        <div className='add-items-container'>
                            {items.map((item, index) => <input key={index} className='bundle-input' type="text" value={item ? item : ""} onChange={(e) => ChangeItem(e,index)}/>)}
                            <div>
                                <button type="button" onClick={AddItem}>Add Item</button>
                                <button type="button" onClick={RemoveItem}>Remove Item</button>
                            </div>
                        </div>
                        <div className='add-items-container'>
                            <p>Specify Budget</p>
                            <input type="text" value={budget ? budget : ""} onChange={(e) => setBudget(e.target.value)} required/>
                            <div>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={ClearBundles}>Clear</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='bundles'>
                    {bundles && bundles.cheapestBundle && <Bundle bundleInfo={bundles.cheapestBundle} type="Cheapest Bundle"/>}
                    {bundles && bundles.recommendedBundle && <Bundle bundleInfo={bundles.recommendedBundle} type="Recommended Bundle"/>}
                </div>
            </div>
        </div>
    )
}
