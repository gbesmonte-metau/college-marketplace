import React from 'react'
import { useState } from 'react'
import "../components-css/Filter.css"
import { categoryArr, GetCategoryNameById} from '../../utils'

export default function Filter({filter, setFilter}) {
    const [price, setPrice] = useState(0);
    const [categoryChecked, setCategoryChecked] = useState(new Array(categoryArr.length).fill(false));

    function HandleFilter(e){
        e.preventDefault();
        const categories = categoryChecked.map((item, index) => item ? GetCategoryNameById(index) : null).filter(item => item !== null);
        setFilter({
            ...filter,
            price: price || undefined,
            category: categories.length > 0 ? categories : null,
        })
    }
    function HandleCategoryChange(id){
        const updatedCategoryChecked = categoryChecked.map((item, index) => index === id ? !item : item);
        setCategoryChecked(updatedCategoryChecked);
    }
    function ClearFilter(){
        setPrice(0);
        setCategoryChecked(new Array(categoryArr.length).fill(false));
        setFilter({...filter, price: undefined, category: null});
    }

    return (
        <div className='filter-box'>
            <form onSubmit={HandleFilter}>
            <div className='filter-price'>
                <p>Price:</p>
                <input type='range' min='0' max='1000' value={price} onChange={(e) => setPrice(parseInt(e.target.value).toFixed(2))}/>
                <label htmlFor='range'>${price}</label>
            </div>
            <div className='filter-category'>
                <p>Category:</p>
                {categoryArr.slice(1,categoryArr.length).map((c, id) => (
                    <div className='filter' key={id+1}>
                        <input type='checkbox' id={c} checked={categoryChecked[id+1]} onChange={() => HandleCategoryChange(id+1)}/>
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
            <button type='submit'>Apply Filter</button>
            <button type='button' onClick={ClearFilter}>Clear Filter</button>
            </form>
        </div>
    )
}
