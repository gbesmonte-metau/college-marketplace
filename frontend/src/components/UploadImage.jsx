import { useState } from "react";

export default function UploadImage({ url, setUrl }) {
  const [loading, setLoading] = useState(false);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  async function uploadSingleImage(base64) {
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_URL + "/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64 }),
      });
      if (response.ok) {
        const data = await response.json();
        setUrl(data.url);
        alert("Image uploaded successfully");
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Error uploading image- upload will retry in the background");
    } finally {
      setLoading(false);
    }
  }

  const uploadImage = async (event) => {
    const files = event.target.files;
    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }
  };

  return (
    <div>
      <div>
        {loading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          <div>
            <label htmlFor="dropzone-file">
              <input onChange={uploadImage} id="dropzone-file" type="file" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
