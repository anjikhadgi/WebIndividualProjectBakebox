import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["GET_CUSTOMER_LIST"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/customer/view_customers");
      return response.data;
    },
  });
};

export const useGetCustomerById = (id) => {
  return useQuery({
    queryKey: ["GET_CUSTOMER_BY_ID", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/customer/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// export const useSaveCustomer = () => {
//   return useMutation({
//     mutationKey: "SAVE_CUSTOMER_DATA",
//     mutationFn: (data) => {
//       return axios.post("http://localhost:4000/api/customer/create_customer", data);
//     },
//   });
// };

export const useUpdateCustomer = () => {
  return useMutation({
    mutationKey: "UPDATE_CUSTOMER_DATA",
    mutationFn: ({ id, data }) => {
      return axios.put(`http://localhost:5000/api/customer/${id}`, data);
    },
  });
};

export const useDeleteCustomer = () => {
  return useMutation({
    mutationKey: "DELETE_CUSTOMER_DATA",
    mutationFn: (id) => {
      return axios.delete(`http://localhost:5000/api/customer/${id}`);
    },
  });
};