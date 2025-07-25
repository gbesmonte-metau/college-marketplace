import { useState } from "react";
import UploadImage from "./UploadImage";
import AddressForm from "./AddressForm";
import "../components-css/EditProfile.css";
import { useContext } from "react";
import { UserContext } from "../App";
import { patchRequest } from "../api";

export default function EditProfile({ userInfo, setIsEditOpen }) {
  const [icon, setIcon] = useState(userInfo.icon);
  const [bio, setBio] = useState(userInfo.bio);
  const [location, setLocation] = useState(userInfo.location);
  const [address, setAddress] = useState(userInfo.address);
  const { setUser } = useContext(UserContext);

  async function handleEdit(e) {
    e.preventDefault();
    try {
      const body = {
        icon: icon,
        bio: bio,
        location: location,
        formatted_address: address,
      };
      const url = new URL(import.meta.env.VITE_URL + `/user`);
      const response = await patchRequest(url, body);
      const result = await response.json();
      if (response.ok) {
        alert("Edited post successfully!");
        setIsEditOpen(false);
        setUser(result);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-body">
        {icon ? (
          <img className="edit-icon" src={icon} alt="profile icon" />
        ) : (
          <p>No icon</p>
        )}
        <div>
          <h2>Edit Profile</h2>
          <form onSubmit={handleEdit}>
            <div>
              <p>Icon</p>
              <UploadImage url={icon} setUrl={setIcon} />
            </div>
            <div>
              <p>Bio</p>
              <input
                name="bio"
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Location</p>
              <AddressForm
                setLocation={setLocation}
                setFormattedAddr={setAddress}
              />
              {location && <p>{userInfo.formatted_address}</p>}
            </div>
            <button type="submit">Save</button>
            <button onClick={() => setIsEditOpen(false)}>Close</button>
          </form>
        </div>
      </div>
    </div>
  );
}
