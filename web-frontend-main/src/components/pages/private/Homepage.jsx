import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FrontSection from "./FrontSection";
import Consultation from "./Consult"; // "Consult" component name can remain as it refers to "Consultation"
import "../../../styles/Homepage.css"; // Stylesheet likely contains generic homepage styles

const API_BASE_URL = "http://localhost:5000/api/products"; // Updated port and base URL

const Homepage = () => {
  // Fetch products from the backend
  const { data: products, isLoading, isError } = useQuery({ 
    queryKey: ["GET_PRODUCT_LIST"], // Updated query key
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/view_products`); 
      return response.data;
    },
  });

  if (isLoading) {
    return <p>Loading products...</p>; 
  }

  if (isError) {
    return <p>Error loading products. Please try again later.</p>; 
  }

  return (
    <div>
      {/* Existing Sections */}
      <FrontSection />

      {/* New Section: Display Products */}
      <section className="products-section"> 
        <h2>Explore Products</h2> {/* Updated heading */}
        <div className="product-grid"> 
          {products?.map((product) => ( 
            <div key={product.id} className="product-card"> 
              <img
                src={`http://localhost:5000/product_images/${product.image}`} 
                alt={product.title}
                className="product-image" 
              />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Price:</strong> {product.price} 
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