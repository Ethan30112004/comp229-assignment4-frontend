import React from "react";
import CrudPage from "../components/CrudPage";

export default function ProjectsPage() {
  return (
    <CrudPage
      title="Project"
      resource="projects"
      initialForm={{
        title: "",
        completion: "",
        description: ""
      }}
      fields={[
        { name: "title", label: "Title" },
        { name: "completion", label: "Completion Date", type: "date" },
        { name: "description", label: "Description", type: "textarea" }
      ]}
    />
  );
}