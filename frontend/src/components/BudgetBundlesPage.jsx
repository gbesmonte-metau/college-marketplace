import { useState } from "react";
import Bundle from "./Bundle";
import "../components-css/BudgetBundlesPage.css";
import { postRequest } from "../api";
import Loading from "./Loading";

export default function BudgetBundlesPage() {
  const [items, setItems] = useState([null, null]);
  const [priorityMap, setPriorityMap] = useState({});
  const [budget, setBudget] = useState(null);
  const [bundles, setBundles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function changeItem(e, index) {
    const value = e.target.value;
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  }

  function changePriority(e, item) {
    const value = e.target.value;
    if (item == null || item == ""){
      return;
    }
    setPriorityMap({ ...priorityMap, [item]: value });
  }

  function addItem(e) {
    e.preventDefault();
    setItems([...items, null]);
  }

  function removeItem(e, index) {
    e.preventDefault();
    const item = items[index];
    const newItems = [...items];
    if (newItems.length <= 2) {
      alert("Minimum of 2 items.");
      return;
    }
    newItems.splice(index, 1);
    setItems(newItems);
    const tempMap = { ...priorityMap };
    delete tempMap[item];
    setPriorityMap(tempMap);
  }

  function clearBundles(e) {
    e.preventDefault();
    setBundles(null);
    setItems([null, null]);
    setPriorityMap({});
    setBudget(null);
  }

  async function findBundles(e) {
    e.preventDefault();
    setIsLoading(true);
    const filteredItems = items.filter((item) => item != null && item != "");
    if (filteredItems.length < 2) {
      alert("Please add more items.");
      setIsLoading(false);
      return;
    }
    let priorities = [];
    for (let i = 0; i < filteredItems.length; i++) {
      const priority = priorityMap[filteredItems[i]];
      if (priority == null) {
        setIsLoading(false);
        alert("Please specify a priority for all items.");
        return;
      }
      priorities.push(priority);
    }
    if (budget == null || isNaN(budget)) {
      setIsLoading(false);
      alert("Invalid budget request.");
      return;
    }
    const body = {
      queries: filteredItems,
      budget: parseFloat(budget),
      priorities: priorities,
    };
    const url = new URL(import.meta.env.VITE_URL + "/user/bundles");
    const response = await postRequest(url, body);
    const result = await response.json();
    if (response.ok) {
      setBundles(result);
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="bundle-page">
        <h2>Budget Bundles</h2>
        <div>
          <form onSubmit={findBundles}>
            <div className="add-items-container">
              <p>Add Items</p>
              {items.map((item, index) => (
                <div key={index} className="bundle-inputs">
                  <input
                    key={"item" + index}
                    className="bundle-input"
                    type="text"
                    value={item ? item : ""}
                    onChange={(e) => changeItem(e, index)}
                    placeholder="Enter Item"
                  />
                  <select
                    key={"priority" + index}
                    className="bundle-priority"
                    value={priorityMap[item] ? priorityMap[item] : ""}
                    onChange={(e) => changePriority(e, item)}
                  >
                    {!priorityMap[item] && (
                      <option value="">Select Priority</option>
                    )}
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button type="button" onClick={(e) => removeItem(e, index)}>
                    Remove Item
                  </button>
                </div>
              ))}
              <div>
                <button type="button" onClick={addItem}>
                  Add Item
                </button>
              </div>
            </div>
            <div className="add-items-container">
              <p>Specify Budget</p>
              <input
                type="number"
                value={budget ? budget : ""}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$"
                required
              />
              <div>
                <button type="submit">Submit</button>
                <button type="button" onClick={clearBundles}>
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="bundles">
          {bundles && (
            <div>
              <Bundle
                bundleItems={bundles.cheapestBundle}
                type={"Cheapest Bundle"}
              />
              <Bundle
                bundleItems={bundles.bestValueBundle}
                type={"Best Value Bundle"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
