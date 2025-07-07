import React from "react";
import User from "./User";
import useConversation from "../../statemanage/useConversation.js";

function Users() {
  const { selectedConversation } = useConversation();

  return (
    <div className="users-container">
      {selectedConversation ? (
        <User user={selectedConversation} />
      ) : (
        <p className="text-center text-sm text-lavenderBlue font-oswald mt-4">
          Search for a user by email to start a conversation.
        </p>
      )}
    </div>
  );
}

export default Users;
