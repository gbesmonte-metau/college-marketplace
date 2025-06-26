import React from 'react'
import { useState } from 'react'
import {category, categoryArr} from "../App"
import "../components-css/Filter.css"

export default function Filter({filter, setFilter}) {
    const [price, setPrice] = useState(0);
    const [categoryChecked, setCategoryChecked] = useState(new Array(categoryArr.length).fill(false));

    function HandleFilter(e){
        e.preventDefault();
        const category = categoryChecked.map((item, index) => item ? categoryArr[index] : null).filter(item => item !== null);
        setFilter({
            price: price || undefined,
            category: category.length > 0 ? category : null,
        })

    }
    function HandleCategoryChange(id){
        const updatedCategoryChecked = categoryChecked.map((item, index) => index === id ? !item : item);
        setCategoryChecked(updatedCategoryChecked);
    }

    return (
        <div className='filter-box'>
            <form onSubmit={HandleFilter}>
            <div className='filter-price'>
                <p>Price:</p>
                <input type='range' min='0' max='100' onChange={(e) => setPrice(parseInt(e.target.value).toFixed(2))}/>
                <label htmlFor='range'>${price}</label>
            </div>
            <div className='filter-category'>
                <p>Category:</p>
                {categoryArr.slice(1,categoryArr.length).map((c, id) => (
                    <div className='filter' key={id+1}>
                        <input type='checkbox' id={c} onChange={() => HandleCategoryChange(id+1)}/>
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
            <button type='submit'>Apply Filter</button>
            </form>
        </div>
    )
}
