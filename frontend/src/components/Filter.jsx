import React from 'react'
import { useState } from 'react'
import "../components-css/Filter.css"
import { categoryArr, colorArr} from '../../utils'
import MultiselectFilter from './MultiselectFilter';
import { useContext } from 'react'
import { UserContext } from '../App';

export default function Filter({filter, setFilter}) {
    const [price, setPrice] = useState(0);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [distance, setDistance] = useState("All");
    const [triggerClear, setTriggerClear] = useState(false);
    const { user, setUser } = useContext(UserContext);

    function HandleFilter(e){
        e.preventDefault();
        setFilter({
            ...filter,
            price: price || undefined,
            category: categories.length > 0 ? categories : null,
            color: colors.length > 0 ? colors : null,
            distance: distance || "All"
        })
    }
    function ClearFilter(){
        setPrice(0);
        setDistance("All");
        setFilter({...filter, price: undefined, distance: undefined, category: null, color: null});
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
                {user && user.location && <div>
                    <p>Maximum distance: (miles)</p>
                    <select name="distance" id="distance" value={distance} onChange={(e) => setDistance(e.target.value)}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="All">All</option>
                    </select>
                </div>}
                <p>Category:</p>
                <MultiselectFilter options={categoryArr.slice(1)} setOptions={setCategories} triggerClear={triggerClear}/>
                <p>Color:</p>
                <MultiselectFilter options={colorArr} setOptions={setColors} triggerClear={triggerClear}/>
                <button type='submit'>Apply Filter</button>
                <button type='button' onClick={ClearFilter}>Clear Filter</button>
            </form>
        </div>
    )
}
