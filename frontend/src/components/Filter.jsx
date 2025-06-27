import React from 'react'
import { useState } from 'react'
import "../components-css/Filter.css"
import { categoryArr, GetCategoryArrToBool, GetCategoryIdByName} from '../../utils'

export default function Filter({filter, setFilter}) {
    const [price, setPrice] = useState(0);
    const [categoryChecked, setCategoryChecked] = useState(GetCategoryArrToBool());

    function HandleFilter(e){
        e.preventDefault();
        const categories = Object.keys(categoryChecked).filter((categoryName) => (categoryChecked[categoryName])).map((categoryName) => (GetCategoryIdByName(categoryName)));
        setFilter({
            ...filter,
            price: price || undefined,
            category: categories.length > 0 ? categories : null,
        })
    }
    function HandleCategoryChange(categoryName){
        const updatedCategoryChecked = {...categoryChecked, [categoryName]: !categoryChecked[categoryName]};
        setCategoryChecked(updatedCategoryChecked);
    }
    function ClearFilter(){
        setPrice(0);
        setCategoryChecked(GetCategoryArrToBool());
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
                        <input type='checkbox' id={c} checked={categoryChecked[c]} onChange={() => HandleCategoryChange(c)}/>
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
