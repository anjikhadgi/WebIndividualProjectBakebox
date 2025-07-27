import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/design"; // Base URL for API

// ✅ Get all designs
export const useGetList = () => {
  return useQuery({
    queryKey: ["GET_DESIGN_LIST"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/view_design`);
      return response.data;
    },
  });
};

// ✅ Get a single design by ID
export const useGetById = (id) => {
  return useQuery({
    queryKey: ["GET_DESIGN_BY_ID", id], // Include id to trigger refetch on change
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/${id}`); // Updated endpoint
      return response.data;
    },
    enabled: !!id, // Fetch only when id is available
  });
};

// ✅ Save a new design (with image upload)
export const useSaveDesign = () => {
  return useMutation({
    mutationKey: "SAVE_DESIGN_DATA",
    mutationFn: (formData) => {
      return axios.post(`${API_BASE_URL}/create_design`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
    },
  });
};

// ✅ Update an existing design (with image upload)
export const useUpdateDesign = () => {
  return useMutation({
    mutationKey: "UPDATE_DESIGN_DATA",
    mutationFn: ({ id, formData }) => {
      if (!id) {
        throw new Error("ID is required for updating a design");
      }
      return axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
    },
  });
};

// ✅ Delete a design by ID
export const useDeleteDesign = () => {
  return useMutation({
    mutationKey: "DELETE_DESIGN_DATA",
    mutationFn: (id) => {
      return axios.delete(`${API_BASE_URL}/${id}`);
    },
  });
};