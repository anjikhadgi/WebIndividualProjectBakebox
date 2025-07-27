import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 
import axios from "axios";


export const useSaveBooking = () => {
  const queryClient = useQueryClient(); // Access to query client

  return useMutation({
    mutationKey: "SAVE_BOOKING_DATA",
    mutationFn: (data) => {
      return axios.post("http://localhost:8080/api/booking/create_booking", data);
    },
    onSuccess: () => {
      // Invalidate the bookings query to trigger a re-fetch
      queryClient.invalidateQueries("GET_BOOKING_LIST");
    },
  });
};


export const useGetBookings = () => {
  return useQuery({
    queryKey: ["GET_BOOKING_LIST"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/api/bookings/view_bookings");
      return response.data;
    },
  });
};

export const useGetBookingById = (id) => {
  return useQuery({
    queryKey: ["GET_BOOKING_BY_ID", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8080/api/booking/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};


export const useUpdateBooking = () => {
  return useMutation({
    mutationKey: "UPDATE_BOOKING_DATA",
    mutationFn: ({ id, data }) => {
      return axios.put(`http://localhost:8080/api/booking/${id}`, data);
    },
  });
};

export const useDeleteBooking = () => {
  return useMutation({
    mutationKey: "DELETE_BOOKING_DATA",
    mutationFn: (id) => {
      return axios.delete(`http://localhost:8080/api/booking/${id}`);
    },
  });
};