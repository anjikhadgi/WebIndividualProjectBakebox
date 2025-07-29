import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProducts, useDeleteProduct } from "./query"; // Updated hook imports
import "../../../styles/ProductIndex.css"; // Updated stylesheet import

function ProductIndex() { // Renamed component function
  const { data: productList, refetch } = useGetProducts(); // Renamed data variable and hook
  const deleteApi = useDeleteProduct(); // Renamed hook
  const navigate = useNavigate();

  // Refetch product list when this component is loaded
  useEffect(() => {
    refetch(); // Fetch updated list after navigation
  }, [refetch]);

  const deleteItem = (id) => {
    if (!id) return;
    deleteApi.mutate(id, {
      onSuccess: () => {
        refetch(); // Re-fetch the list after deletion
      },
      onError: (error) => {
        console.error("Failed to delete product:", error); // Updated message
        alert("Failed to delete product. Please try again."); // Updated message
      }
    });
  };

  return (
    <div className="product-index"> {/* Updated class name */}
      <div className="header">
        <h2 className="section-title">Products</h2> {/* Updated title */}
        <div className="button-group">
          <button
            className="btn-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn-add"
            onClick={() => navigate("/admin/products/create")} 
          >
            Add New Product {/* Updated button text */}
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Quantity</th> {/* Renamed column header */}
            <th>Price</th> {/* Renamed column header */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList?.map((product) => ( // Renamed map variable
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>
                <img
                  src={`http://localhost:5000/product_images/${product.image}`}
                  alt={product.title}
                />
              </td>
              <td>{product.description}</td>
              <td>{product.quantity}</td> {/* Display Quantity */}
              <td>{product.price}</td> {/* Display Price */}
              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)} 
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteItem(product.id)}
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductIndex; // Renamed component export