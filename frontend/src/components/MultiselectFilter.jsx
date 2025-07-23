import { useEffect, useState } from "react";

export default function MultiselectFilter({
  options,
  setOptions,
  triggerClear,
}) {
  const [optionChecked, setOptionChecked] = useState(createDict());

  useEffect(() => {
    setOptionChecked(createDict());
    setOptions([]);
  }, [triggerClear]);

  function createDict() {
    let dict = {};
    options.map((item) => {
      dict[item] = false;
    });
    return dict;
  }

  function handleCheckedChange(optionName) {
    const updatedSetOption = {
      ...optionChecked,
      [optionName]: !optionChecked[optionName],
    };
    setOptionChecked(updatedSetOption);
    setOptions(
      Object.keys(updatedSetOption).filter((key) => updatedSetOption[key]),
    );
  }

  return (
    <div className="filter-category">
      {options.map((c, id) => (
        <div className="filter" key={id}>
          <label>
            <input
              id={c}
              type="checkbox"
              checked={optionChecked[c]}
              onChange={() => handleCheckedChange(c)}
            />
            {c}
          </label>
        </div>
      ))}
    </div>
  );
}
