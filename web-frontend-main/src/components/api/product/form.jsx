import React from "react";
import { useForm } from "react-hook-form";
// Renamed hooks to reflect Product operations
import { useSaveProduct, useUpdateProduct, useGetProductById } from "./query"; // Updated import names
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/ProductForm.css"; // Updated import path for styles

function ProductForm() { // Renamed component function
  const { id } = useParams(); // Extract the `id` parameter from the URL
  const navigate = useNavigate();
  const isEditMode = !!id; // Check if we're in edit mode

  // Fetch product data if in edit mode
  const { data: product, isLoading } = useGetProductById(id); // Renamed data variable and hook

  // Initialize the form with default values
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      quantity: product?.quantity || 0, // Renamed from room, set default to 0 for number input
      price: product?.price || 0, // Renamed from style, set default to 0 for number input
    },
  });

  // Reset the form when product data is fetched
  React.useEffect(() => {
    if (product) { // Renamed data variable
      reset({
        title: product.title,
        description: product.description,
        quantity: product.quantity, // Renamed field
        price: product.price, // Renamed field
      });
    }
  }, [product, reset]); // Renamed dependency

  // Save or update product
  const saveApi = useSaveProduct(); // Renamed hook
  const updateApi = useUpdateProduct(); // Renamed hook

  const onSubmit = (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("quantity", formData.quantity); // Renamed field
    dataToSend.append("price", formData.price); // Renamed field

    // Append image if it exists
    if (formData.image?.[0]) {
      dataToSend.append("image", formData.image[0]);
    }

    if (isEditMode) {
      // Update existing product
      updateApi.mutate(
        { id, formData: dataToSend }, // 'formData' is an object here
        {
          onSuccess: () => {
            alert("Product updated successfully!"); // Updated message
            navigate("/admin/products"); // Updated navigation path
          },
          onError: (error) => {
            alert("Failed to update product. Please try again."); // Updated message
            console.error(error);
          },
        }
      );
    } else {
      // Create new product
      saveApi.mutate(dataToSend, {
        onSuccess: () => {
          alert("Product created successfully!"); // Updated message
          reset(); // Reset the form after success
          navigate("/admin/products"); // Updated navigation path
        },
        onError: (error) => {
          alert("Failed to create product. Please try again."); // Updated message
          console.error(error);
        },
      });
    }
  };

  if (isLoading) {
    return <p>Loading product data...</p>; {/* Updated message */}
  }

  return (
    <div className="product-form-container"> {/* Updated class name */}
      <h1>{isEditMode ? "Edit Product" : "Create Product"}</h1> {/* Updated headings */}
      <button
        className="back-button"
        onClick={() => navigate("/admin/products")} // Updated navigation path
      >
        ← Back to Products {/* Updated button text */}
      </button>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="product-form"> {/* Updated class name */}
        <div className="form-group">
          <label>Title</label>
          <input type="text" {...register("title")} required className="form-input" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register("description")} required className="form-input" />
        </div>

        <div className="form-group">
          <label>Quantity</label> {/* Updated label */}
          <input type="number" {...register("quantity", { valueAsNumber: true })} required className="form-input" min="0" /> {/* Changed to number input */}
        </div>

        <div className="form-group">
          <label>Price</label> {/* Updated label */}
          <input type="number" {...register("price", { valueAsNumber: true })} required className="form-input" step="0.01" min="0" /> {/* Changed to number input */}
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" {...register("image")} className="form-input" />
        </div>

        <button type="submit" className="submit-button">
          {isEditMode ? "Update Product" : "Create Product"} {/* Updated button text */}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;