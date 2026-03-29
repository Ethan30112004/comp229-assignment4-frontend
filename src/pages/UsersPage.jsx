import React from "react";
import CrudPage from "../components/CrudPage";

export default function UsersPage() {
  return (
    <CrudPage
      title="User"
      resource="users"
      initialForm={{
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      }}
      fields={[
        { name: "firstname", label: "First Name" },
        { name: "lastname", label: "Last Name" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "text" }
      ]}
    />
  );
}