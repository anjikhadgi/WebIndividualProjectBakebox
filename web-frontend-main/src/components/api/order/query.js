import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export const useSaveOrder = () => { // Renamed hook
  const queryClient = useQueryClient(); // Access to query client

  return useMutation({
    mutationKey: "SAVE_ORDER_DATA", // Renamed mutation key
    mutationFn: (data) => {
      // Updated port and endpoint to match new Order API
      return axios.post("http://localhost:5000/api/orders/create_order", data);
    },
    onSuccess: () => {
      // Invalidate the orders query to trigger a re-fetch
      queryClient.invalidateQueries("GET_ORDER_LIST"); // Renamed query key
    },
  });
};


export const useGetOrders = () => { // Renamed hook
  return useQuery({
    queryKey: ["GET_ORDER_LIST"], // Renamed query key
    queryFn: async () => {
      // Updated port and endpoint to match new Order API
      const response = await axios.get("http://localhost:5000/api/orders/view_orders");
      return response.data;
    },
  });
};

export const useGetOrderById = (id) => { // Renamed hook
  return useQuery({
    queryKey: ["GET_ORDER_BY_ID", id], // Renamed query key
    queryFn: async () => {
      // Updated port and endpoint to match new Order API
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};


export const useUpdateOrder = () => { // Renamed hook
  return useMutation({
    mutationKey: "UPDATE_ORDER_DATA", // Renamed mutation key
    mutationFn: ({ id, data }) => {
      // Updated port and endpoint to match new Order API (assuming /api/orders/orders/:id for update)
      return axios.put(`http://localhost:5000/api/orders/orders/${id}`, data);
    },
  });
};

export const useDeleteOrder = () => { // Renamed hook
  return useMutation({
    mutationKey: "DELETE_ORDER_DATA", // Renamed mutation key
    mutationFn: (id) => {
      // Updated port and endpoint to match new Order API (assuming /api/orders/orders/:id for delete)
      return axios.delete(`http://localhost:5000/api/orders/orders/${id}`);
    },
  });
};