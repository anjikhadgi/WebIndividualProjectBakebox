import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// Updated Base URL for Product API
const API_BASE_URL = "http://localhost:5000/api/products"; // Port and path updated

// ✅ Get all products
export const useGetProducts = () => { // Renamed hook
  return useQuery({
    queryKey: ["GET_PRODUCT_LIST"], // Renamed query key
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/view_products`); // Endpoint updated
      return response.data;
    },
  });
};

// ✅ Get a single product by ID
export const useGetProductById = (id) => { // Renamed hook
  return useQuery({
    queryKey: ["GET_PRODUCT_BY_ID", id], // Renamed query key
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    },
    enabled: !!id, // Fetch only when id is available
  });
};

// ✅ Save a new product (with image upload)
export const useSaveProduct = () => { // Renamed hook
  return useMutation({
    mutationKey: "SAVE_PRODUCT_DATA", // Renamed mutation key
    mutationFn: (formData) => {
      return axios.post(`${API_BASE_URL}/create_product`, formData, { // Endpoint updated
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
    },
  });
};

// ✅ Update an existing product (with image upload)
export const useUpdateProduct = () => { // Renamed hook
  return useMutation({
    mutationKey: "UPDATE_PRODUCT_DATA", // Renamed mutation key
    mutationFn: ({ id, formData }) => {
      if (!id) {
        throw new Error("ID is required for updating a product"); // Updated error message
      }
      return axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
    },
  });
};

// ✅ Delete a product by ID
export const useDeleteProduct = () => { // Renamed hook
  return useMutation({
    mutationKey: "DELETE_PRODUCT_DATA", // Renamed mutation key
    mutationFn: (id) => {
      return axios.delete(`${API_BASE_URL}/${id}`);
    },
  });
};