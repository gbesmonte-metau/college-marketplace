import React from 'react'
import { useState } from 'react'
import "../components-css/Filter.css"
import { categoryArr} from '../../utils'
import MultiselectFilter from './MultiselectFilter';

export default function Filter({filter, setFilter}) {
    const [price, setPrice] = useState(0);
    const [categories, setCategories] = useState([]);
    const [triggerClear, setTriggerClear] = useState(false);

    function HandleFilter(e){
        e.preventDefault();
        setFilter({
            ...filter,
            price: price || undefined,
            category: categories.length > 0 ? categories : null,
        })
    }
    function ClearFilter(){
        setPrice(0);
        setFilter({...filter, price: undefined, category: null});
        setTriggerClear(!triggerClear);
    }

    return (
        <div className='filter-box'>
            <form onSubmit={HandleFilter}>
                <div className='filter-price'>
                    <p>Price:</p>
                    <input type='range' min='0' max='1000' value={price} onChange={(e) => setPrice(parseInt(e.target.value).toFixed(2))}/>
                    <label htmlFor='range'>${price}</label>
                </div>
                <MultiselectFilter options={categoryArr.slice(1)} setOptions={setCategories} triggerClear={triggerClear}/>

                <button type='submit'>Apply Filter</button>
                <button type='button' onClick={ClearFilter}>Clear Filter</button>
            </form>
        </div>
    )
}
