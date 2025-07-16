import React from 'react'
import { useState } from 'react'

export default function BudgetBundlesPage() {
    const [items, setItems] = useState([null, null, null]);

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

    function FindBundles(e) {
        e.preventDefault();
        //TODO: Find bundles and display
    }

    return (
        <div className='page'>
            <h2>Budget Bundles</h2>
            <form onSubmit={FindBundles}>
                <p>Add Items</p>
                {items.map((item, index) => <input key={index} className='bundle-input' type="text" value={item ? item : ""} onChange={(e) => ChangeItem(e,index)}/>)}
                <button type="button" onClick={AddItem}>Add Item</button>
                <p>Specify Budget</p>
                <input type="text" required/>
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}
