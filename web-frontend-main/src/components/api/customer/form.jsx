// import { useForm } from "react-hook-form";
// import { useGetCustomerById, useSaveCustomer, useUpdateCustomer } from "./query";
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// function CustomerForm() {
//   const params = useParams();
//   const navigate = useNavigate();
//   const { data: customer, isLoading } = useGetCustomerById(params?.id);
  
//   const { register, handleSubmit, reset, formState: { errors } } = useForm({
//     defaultValues: {
//       full_name: "",
//       email: "",
//       contact_number: "",
//     },
//   });

//   useEffect(() => {
//     if (customer) {
//       reset(customer);
//     }
//   }, [customer, reset]);

//   const saveApi = useSaveCustomer();
//   const updateApi = useUpdateCustomer();

//   const onSubmit = (data) => {
//     if (params?.id) {
//       updateApi.mutate(
//         { id: params.id, data },
//         {
//           onSuccess: () => navigate("/admin/customer"),
//         }
//       );
//     } else {
//       saveApi.mutate(data, {
//         onSuccess: () => navigate("/admin/customer"),
//       });
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">
//         {params?.id ? "Edit Customer" : "Add New Customer"}
//       </h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Full Name</label>
//           <input
//             type="text"
//             {...register("full_name", { required: "Full name is required" })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//           {errors.full_name && (
//             <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             {...register("email", { 
//               required: "Email is required",
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: "Invalid email address"
//               }
//             })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//           <input
//             type="text"
//             {...register("contact_number", { required: "Contact number is required" })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//           />
//           {errors.contact_number && (
//             <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>
//           )}
//         </div>

//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {params?.id ? "Update" : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/customer")}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CustomerForm;