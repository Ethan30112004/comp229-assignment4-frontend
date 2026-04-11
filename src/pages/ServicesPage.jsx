import React from "react";
import CrudPage from "../components/CrudPage";

export default function ServicesPage() {
  return (
    <CrudPage
      title="Service"
      resource="services"
      initialForm={{
        name: "",
        description: ""
      }}
      fields={[
        { name: "name", label: "Service Name" },
        { name: "description", label: "Description", type: "textarea" }
      ]}
    />
  );
}