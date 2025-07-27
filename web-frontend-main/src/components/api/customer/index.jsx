import { useNavigate } from "react-router-dom";
import { useGetCustomers, useDeleteCustomer } from "./query";
import '../../../styles/CustomerDashboard.css';

function CustomerIndex() {
  const { data: customerList, refetch } = useGetCustomers();
  const deleteApi = useDeleteCustomer();
  const navigate = useNavigate();

  const deleteItem = (id) => {
    if (!id) return;

    deleteApi.mutate(id, {
      onSuccess: () => {
        refetch(); // Refresh customer list
      },
    });
  };

  return (
    <div className="customer-index">
      <div className="header">
        <h2 className="section-title">Customers</h2>
        <div className="button-group">
          <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerList && customerList.length > 0 ? (
            customerList.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.contact_number}</td>
                <td>
                  <button onClick={() => deleteItem(customer.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerIndex;