import React, { useState } from "react";
import {
  db,
  firestore_collection_name,
  storage,
} from "../../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./MemoryForm.css";
import { gradientPalette, textPalette } from "../../utils/color";

// Helper function to format the date as "31st December 2024"
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Special case for 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayFormatted = `${day}${daySuffix(day)}`;
  const month = date.toLocaleString("default", { month: "long" }); // Full month name
  const year = date.getFullYear();

  return `${dayFormatted} ${month} ${year}`;
};

const MemoryForm = ({ user }) => {
  // State for form data
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    emoji: "",
    gradient: "linear-gradient(to right, #FFD700, #FFA500)",
    text: "#fff",
    images: [], // To store the selected image file
  });

  // State for loading form submission
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files.slice(0, 10), // Limit to 10 images
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date } = formData;
    const dateDisplay = date ? formatDateForDisplay(date) : ""; // Format the date if present

    try {
      setIsLoading(true); // Set loading to true when submitting the form

      const querySnapshot = await getDocs(
        collection(db, firestore_collection_name)
      );
      const fetchedData = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.userId !== user.uid) return;
        fetchedData.push({ id: doc.id, ...docData });
      });

      console.log("Next index:", fetchedData.length);

      const { images, ...formDataWithoutImages } = formData;

      // Handle multiple image uploads
      let imageUrls = [];
      if (images.length > 0) {
        const uploadPromises = images.map((image, index) => {
          const storageRef = ref(
            storage,
            `${user.uid}/${fetchedData.length}/${index}_${image.name}`
          );
          return uploadBytes(storageRef, image)
            .then(() => getDownloadURL(storageRef))
            .then((url) => imageUrls.push(url))
            .catch((error) => {
              console.error("Error uploading image:", error);
            });
        });

        await Promise.all(uploadPromises);
      }

      const gradientIndex = fetchedData.length % gradientPalette.length;

      await addDoc(collection(db, firestore_collection_name), {
        ...formDataWithoutImages,
        dateDisplay,
        imageUrls, // Store array of image URLs
        gradient: gradientPalette[gradientIndex],
        text: textPalette[gradientIndex],
        index: fetchedData.length,
        userId: user.uid,
      });

      alert("Memory added successfully!");

      // Reset form data
      setFormData({
        date: "",
        description: "",
        emoji: "",
        images: [], // Reset the image field
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(error);
    } finally {
      setIsLoading(false); // Set loading to false when finished
    }
  };

  return (
    <div className="memory-form-container">
      <div className="memory-form-title-section">
        <h1>Add New Memory</h1>
        <h1>🤍🎥 🫧🎞️</h1>
      </div>
      <form onSubmit={handleSubmit} className="memory-form">
        <h1 className="memory-form-title">Add New Memory</h1>
        <div>
          <label>Date</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. First Competition"
            required
          />
        </div>
        <div>
          <label>Emoji</label>
          <input
            type="text"
            name="emoji"
            value={formData.emoji}
            onChange={handleChange}
            placeholder="e.g. 🏆"
            required
          />
        </div>
        {/* <div>
          <label>Gradient:</label>
          <select
            name="gradient"
            value={formData.gradient}
            onChange={handleChange}
          >
            {gradientPalette.map((grad, index) => (
              <option key={index} value={grad}>
                {grad}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Text Color:</label>
          <select
            name="text"
            value={formData.text}
            onChange={handleChange}
          >
            {textPalette.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div> */}
        <div className="file-upload-container">
          <label htmlFor="image" className="file-label">
            Upload Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
            multiple // Allow multiple file selection
          />

          {formData.images.length > 0 && (
            <div className="file-info">
              {formData.images.map((image, index) => (
                <span key={index}>{image.name}</span>
              ))}
            </div>
          )}
        </div>
        {/* <div>
          <label>Index (auto-filled):</label>
          <input
            type="number"
            name="index"
            value={formData.index}
            onChange={handleChange}
            disabled
          />
        </div> */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Memory"}
        </button>
      </form>
    </div>
  );
};

export default MemoryForm;
