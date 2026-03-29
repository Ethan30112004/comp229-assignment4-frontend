import React from "react";
import CrudPage from "../components/CrudPage";

export default function ContactsPage() {
  return (
    <CrudPage
      title="Contact"
      resource="references"
      initialForm={{
        firstname: "",
        lastname: "",
        email: "",
        position: "",
        company: ""
      }}
      fields={[
        { name: "firstname", label: "First Name" },
        { name: "lastname", label: "Last Name" },
        { name: "email", label: "Email", type: "email" },
        { name: "position", label: "Position" },
        { name: "company", label: "Company" }
      ]}
    />
  );
}