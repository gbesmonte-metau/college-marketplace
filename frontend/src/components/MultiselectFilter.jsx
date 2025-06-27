import {useEffect, useState} from 'react'

export default function MultiselectFilter({options, setOptions, triggerClear}) {
    const [optionChecked, setOptionChecked] = useState(CreateDict());

    useEffect(() => {
        setOptionChecked(CreateDict());
        setOptions([]);
    }, [triggerClear])

    function CreateDict(){
        let dict = {};
        options.map((item) => {
            dict[item] = false;
        })
        return dict;
    }

    function HandleCheckedChange(optionName){
        const updatedSetOption = {...optionChecked, [optionName]: !optionChecked[optionName]};
        setOptionChecked(updatedSetOption);
        setOptions(Object.keys(updatedSetOption).filter((key) => updatedSetOption[key]));
    }

    return (
        <div className='filter-category'>
            <p>Category:</p>
            {options.map((c, id) => (
                <div className='filter' key={id}>
                    <input type='checkbox' checked={optionChecked[c]} onChange={() => HandleCheckedChange(c)}/>
                    <label htmlFor={c}>{c}</label>
                </div>
            ))}
        </div>
    )
}
