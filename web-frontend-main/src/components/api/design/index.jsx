import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetList, useDeleteDesign } from "./query";
import "../../../styles/DesignIndex.css";

function DesignIndex() {
  const { data: designList, refetch } = useGetList();
  const deleteApi = useDeleteDesign();
  const navigate = useNavigate();

  // Refetch design list when this component is loaded
  useEffect(() => {
    refetch(); // Fetch updated list after navigation
  }, [refetch]);

  const deleteItem = (id) => {
    if (!id) return;
    deleteApi.mutate(id, {
      onSuccess: () => {
        refetch(); // Re-fetch the list after deletion
      },
    });
  };

  return (
    <div className="design-index">
      <div className="header">
        <h2 className="section-title">Designs</h2>
        <div className="button-group">
          <button
            className="btn-back"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn-add"
            onClick={() => navigate("/admin/design/create")}
          >
             Add New Design
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Room</th> {/* Added Room column */}
            <th>Style</th> {/* Added Style column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designList?.map((design) => (
            <tr key={design.id}>
              <td>{design.title}</td>
              <td>
                <img
                  src={`http://localhost:8080/design_images/${design.image}`}
                  alt={design.title}
                  className="design-image"
                />
              </td>
              <td>{design.description}</td>
              <td>{design.room}</td> {/* Display Room */}
              <td>{design.style}</td> {/* Display Style */}
              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/admin/design/edit/${design.id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteItem(design.id)}
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

export default DesignIndex;