import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import userGetAllUsers from "../../context/userGetAllUsers.jsx";
import useConversation from "../../statemanage/useConversation.js";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers] = userGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return; // If search is empty, return.

    // Find the user that matches the search term
    const conversation = allUsers.find((user) =>
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch(""); // Clear the search input
    } else {
      toast.error("User not Found having this Username");
    }
  };

  return (
    <div className="h-[10vh] border-cyberNavy">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4 items-center">
            {/* Input Field */}
            <label className="border-[1px] border-neonMagenta bg-cyberNavy rounded-2xl flex items-center gap-2 w-[80%] p-3  transition-all">
              <input
                type="text"
                className="grow outline-none bg-cyberNavy text-lavenderBlue font-montserrat font-medium w-[80%] placeholder-neonCyan "
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            {/* Search Icon Button */}
            <button
              type="submit"
              className="text-4xl text-lavenderBlue bg-cyberNavy hover:text-cyberPink hover:shadow-md hover:shadow-neonCyan hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-2"
            >
              <IoSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
