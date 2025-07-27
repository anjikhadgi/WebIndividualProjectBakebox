import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FrontSection from "./FrontSection";
import Consultation from "./Consult";
import "../../../styles/Homepage.css";

const API_BASE_URL = "http://localhost:8080/api/design"; // Replace with your backend URL

const Homepage = () => {
  // Fetch designs from the backend
  const { data: designs, isLoading, isError } = useQuery({
    queryKey: ["GET_DESIGN_LIST"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/view_design`);
      return response.data;
    },
  });

  if (isLoading) {
    return <p>Loading designs...</p>;
  }

  if (isError) {
    return <p>Error loading designs. Please try again later.</p>;
  }

  return (
    <div>
      {/* Existing Sections */}
      <FrontSection />

      {/* New Section: Display Designs */}
      <section className="designs-section">
        <h2>Explore Designs</h2>
        <div className="design-grid">
          {designs?.map((design) => (
            <div key={design.id} className="design-card">
              <img
                src={`http://localhost:8080/design_images/${design.image}`} // Replace with your image URL path
                alt={design.title}
                className="design-image"
              />
              <h3>{design.title}</h3>
              <p>{design.description}</p>
              <p>
                <strong>Room:</strong> {design.room}
              </p>
              <p>
                <strong>Style:</strong> {design.style}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Existing Section */}
      <Consultation />
    </div>
  );
};

export default Homepage;