import React from "react";
import CrudPage from "../components/CrudPage";

export default function ServicesPage() {
  return (
    <CrudPage
      title="Service"
      resource="services"
      initialForm={{
        title: "",
        description: ""
      }}
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea" }
      ]}
    />
  );
}