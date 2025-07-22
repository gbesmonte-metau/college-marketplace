import React from 'react'
import { useState } from 'react'
import Bundle from './Bundle';
import '../components-css/BudgetBundlesPage.css'

export default function BudgetBundlesPage() {
    const [items, setItems] = useState([null, null]);
    const [priorities, setPriorities] = useState([null, null]);
    const [budget, setBudget] = useState(null);
    const [bundles, setBundles] = useState(null);
    const [bundlesValid, setBundlesValid] = useState(false);

    const priorityOptions = {
        High: 1,
        Medium: 2,
        Low: 3
    }

    function ChangeItem(e, index) {
        const value = e.target.value;
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    }

    function ChangePriority(e, index) {
        const value = e.target.value;
        const newPriorities = [...priorities];
        newPriorities[index] = value;
        setPriorities(newPriorities);
    }

    function AddItem(e) {
        e.preventDefault();
        setItems([...items, null]);
        setPriorities([...priorities, null]);
    }

    function RemoveItem(e) {
        e.preventDefault();
        const newItems = [...items];
        newItems.pop();
        setItems(newItems);
        const newPriorities = [...priorities];
        newPriorities.pop();
        setPriorities(newPriorities);
    }

    function ClearBundles(e) {
        e.preventDefault();
        setBundles(null);
        setItems([null, null]);
        setPriorities([null, null]);
        setBudget(null);
    }

    async function FindBundles(e) {
        e.preventDefault();
        const filteredItems = items.filter(item => item != null && item != '');
        if (filteredItems.length < 2) {
            alert("Please add more items.");
            return;
        }
        for (let i = 0; i < filteredItems.length; i++) {
            if (priorities[i] == null) {
                alert("Please specify a priority for all items.");
                return;
            }
        }
        if (budget == null) {
            alert("Invalid budget request.");
            return;
        }
        const url = new URL(import.meta.env.VITE_URL + '/user/bundles');
        const body = {
            queries: filteredItems,
            budget: parseFloat(budget),
            priorities: priorities,
        }
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const result = await response.json();
        if (response.ok) {
            setBundlesValid(result.isValid);
            setBundles(result);
        }
        else{
            alert(result.message);
        }
    }

    return (
        <div className='page'>
            <div className='bundle-page'>
                <h2>Budget Bundles</h2>
                <div>
                    <form onSubmit={FindBundles}>
                        <div className='add-items-container'>
                            <p>Add Items</p>
                            {items.map((item, index) =>
                            <div key={index} className='bundle-inputs'>
                                <input key={"item" + index} className='bundle-input' type="text" value={item ? item : ""} onChange={(e) => ChangeItem(e,index)} placeholder='Enter Item'/>
                                <select key={"priority" + index} className='bundle-priority' value={priorities[index] ? priorities[index] : ''} onChange={(e) => ChangePriority(e, index)}>
                                    {!priorities[index] && <option value=''>Select Priority</option>}
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>)}
                            <div>
                                <button type="button" onClick={AddItem}>Add Item</button>
                                <button type="button" onClick={RemoveItem}>Remove Item</button>
                            </div>
                        </div>
                        <div className='add-items-container'>
                            <p>Specify Budget</p>
                            <input type="number" value={budget ? budget : ""} onChange={(e) => setBudget(e.target.value)} placeholder='$' required/>
                            <div>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={ClearBundles}>Clear</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='bundles'>
                    {bundles && (
                        <div>
                            <Bundle bundleItems={bundles.cheapestBundle} type={"Cheapest Bundle"}/>
                            <Bundle bundleItems={bundles.bestValueBundle} type={"Best Value Bundle"}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
