import { useEffect } from "react";
import "../components-css/CreatePost.css";
import {
  categoryArr,
  getCategoryIdByName,
  conditionArr,
  colorArr,
} from "../../utils";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router";
import { postRequest } from "../api";
import AddressForm from "./AddressForm";
import UploadImage from "./UploadImage";
import { MdErrorOutline } from "react-icons/md";

export default function CreatePost({ setIsCreatePostOpen }) {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  //create variables
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("Other");
  const [location, setLocation] = useState(null);
  const [formattedAddr, setFormattedAddr] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create a post");
      return;
    }
    const isPostComplete = price && category && name && location;
    if (!isPostComplete) {
      setError("Please fill out all required fields");
      return;
    }
    const body = {
      price: parseFloat(price),
      category: parseInt(category),
      name: name,
      description: description,
      condition: condition,
      brand: brand,
      color: color,
      time_created: Date.now().toString(),
      location: location,
      formatted_address: formattedAddr,
      image_url: imageUrl,
      authorId: user.id,
    };
    const url = new URL(import.meta.env.VITE_URL + "/posts");
    const response = await postRequest(url, body);
    const result = await response.json();
    if (response.ok) {
      setIsCreatePostOpen(false);
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="create-modal">
      <div className="create-body">
        <h2>Create Post</h2>
        <div className="create-box">
          {imageUrl ? (
            <img className="create-post-img" src={imageUrl} alt="uploaded image" />
          ) : (
            <img
              className="create-post-img"
              src="../../placeholder.png"
              alt="placeholder image"
            />
          )}
          <form onSubmit={handleCreate}>
            <div className="create-option">
              <p>Price (required)</p>
              <input
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="create-option">
              <p>Category (required)</p>
              <select
                name="category"
                id="category"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
              >
                {!category && <option value=""></option>}
                {categoryArr.slice(0, -1).map((category, index) => (
                  <option key={index} value={getCategoryIdByName(category)}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-option">
              <p>Name (required)</p>
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="create-option">
              <p>Description</p>
              <input
                name="description"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="create-option">
              <p>Condition</p>
              <select
                name="condition"
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                {conditionArr.slice(0, -1).map((condition, index) => (
                  <option key={index} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-option">
              <p>Brand</p>
              <input
                name="brand"
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="create-option">
              <p>Color</p>
              <select
                name="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                {colorArr.slice(0, -1).map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-option">
              <p>Location (required)</p>
              <AddressForm
                setLocation={setLocation}
                setFormattedAddr={setFormattedAddr}
              />
            </div>
            <div className="create-option">
              <p>Image</p>
              <UploadImage url={imageUrl} setUrl={setImageUrl} />
            </div>
            <button type="submit">Create</button>
            <button onClick={() => setIsCreatePostOpen(false)}>Close</button>
            <div className={`error-box ${error ? "visible" : "hidden"}`}>
              <MdErrorOutline /> <p> Error: {error || "No error"}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
