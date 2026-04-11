import React from "react";
import CrudPage from "../components/CrudPage";

export default function UsersPage() {
  return (
    <CrudPage
      title="User"
      resource="users"
      initialForm={{
        username: "",
        email: "",
        password: ""
      }}
      fields={[
        { name: "username", label: "Username" },
        { name: "email", label: "Email" },
        {
          name: "password",
          label: "Password",
          type: "password",
          hideInList: true,
          clearOnEdit: true
        }
      ]}
    />
  );
}