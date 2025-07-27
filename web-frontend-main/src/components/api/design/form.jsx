import React from "react";
import { useForm } from "react-hook-form";
import { useSaveDesign, useUpdateDesign, useGetById } from "./query";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/DesignForm.css";

function DesignForm() {
  const { id } = useParams(); // Extract the `id` parameter from the URL
  const navigate = useNavigate();
  const isEditMode = !!id; // Check if we're in edit mode

  // Fetch design data if in edit mode
  const { data: design, isLoading } = useGetById(id);

  // Initialize the form with default values
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: design?.title || "",
      description: design?.description || "",
      room: design?.room || "",
      style: design?.style || "",
    },
  });

  // Reset the form when design data is fetched
  React.useEffect(() => {
    if (design) {
      reset({
        title: design.title,
        description: design.description,
        room: design.room,
        style: design.style,
      });
    }
  }, [design, reset]);

  // Save or update design
  const saveApi = useSaveDesign();
  const updateApi = useUpdateDesign();

  const onSubmit = (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("room", formData.room);
    dataToSend.append("style", formData.style);

    // Append image if it exists
    if (formData.image?.[0]) {
      dataToSend.append("image", formData.image[0]);
    }

    if (isEditMode) {
      // Update existing design
      updateApi.mutate(
        { id, formData: dataToSend },
        {
          onSuccess: () => {
            alert("Design updated successfully!");
            navigate("/admin/design"); // Navigate back to the design list
          },
          onError: (error) => {
            alert("Failed to update design. Please try again.");
            console.error(error);
          },
        }
      );
    } else {
      // Create new design
      saveApi.mutate(dataToSend, {
        onSuccess: () => {
          alert("Design created successfully!");
          reset(); // Reset the form after success
          navigate("/admin/design"); // Navigate back to the design list
        },
        onError: (error) => {
          alert("Failed to create design. Please try again.");
          console.error(error);
        },
      });
    }
  };

  if (isLoading) {
    return <p>Loading design data...</p>;
  }

  return (
    <div className="design-form-container">
      <h1>{isEditMode ? "Edit Design" : "Create Design"}</h1>
      <button
        className="back-button"
        onClick={() => navigate("/admin/design")}
      >
        ← Back to Designs
      </button>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="design-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" {...register("title")} required className="form-input" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea {...register("description")} required className="form-input" />
        </div>

        <div className="form-group">
          <label>Room</label>
          <select {...register("room")} required className="form-input">
            <option value="">Select Room</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Office">Office</option>
            <option value="Dining">Dining</option>
          </select>
        </div>

        <div className="form-group">
          <label>Style</label>
          <select {...register("style")} required className="form-input">
            <option value="">Select Style</option>
            <option value="Modern">Modern</option>
            <option value="Rustic">Rustic</option>
            <option value="Traditional">Traditional</option>
            <option value="Minimalist">Minimalist</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" {...register("image")} className="form-input" />
        </div>

        <button type="submit" className="submit-button">
          {isEditMode ? "Update Design" : "Create Design"}
        </button>
      </form>
    </div>
  );
}

export default DesignForm;