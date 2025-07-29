import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FrontSection from "./FrontSection";
import Consultation from "./Consult"; // "Consult" component name can remain as it refers to "Consultation"
import "../../../styles/Homepage.css"; // Stylesheet likely contains generic homepage styles

const API_BASE_URL = "http://localhost:5000/api/products"; // Updated port and base URL

const Homepage = () => {
  // Fetch products from the backend
  const { data: products, isLoading, isError } = useQuery({ // Renamed 'designs' to 'products'
    queryKey: ["GET_PRODUCT_LIST"], // Updated query key
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/view_products`); // Updated endpoint
      return response.data;
    },
  });

  if (isLoading) {
    return <p>Loading products...</p>; // Updated message
  }

  if (isError) {
    return <p>Error loading products. Please try again later.</p>; // Updated message
  }

  return (
    <div>
      {/* Existing Sections */}
      <FrontSection />

      {/* New Section: Display Products */}
      <section className="products-section"> {/* Renamed class name */}
        <h2>Explore Products</h2> {/* Updated heading */}
        <div className="product-grid"> {/* Renamed class name */}
          {products?.map((product) => ( // Renamed map variable
            <div key={product.id} className="product-card"> {/* Renamed class name */}
              <img
                src={`http://localhost:5000/product_images/${product.image}`} // Updated port and image path
                alt={product.title}
                className="product-image" // Updated class name
              />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Quantity:</strong> {product.quantity} {/* Renamed 'Room' to 'Quantity' */}
              </p>
              <p>
                <strong>Price:</strong> {product.price} {/* Renamed 'Style' to 'Price' */}
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