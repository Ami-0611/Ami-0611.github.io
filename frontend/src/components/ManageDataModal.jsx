import React, { useState, useEffect, useRef } from "react";
import Snackbar from "./Snackbar";

const ManageDataModal = ({
  isOpen,
  onClose,
  dataType,
  data,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      setFilteredItems(filtered);
    }
  }, [items, searchTerm]);

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, isVisible: true });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, isVisible: false });
  };

  const handleAdd = async () => {
    if (!newItemName.trim()) {
      showSnackbar("Please enter a valid name", "error");
      return;
    }

    try {
      setIsLoading(true);
      const result = await onAdd(newItemName.trim());
      setNewItemName("");

      // Add the new item to the local state immediately
      if (result && result.id) {
        const newItem = { id: result.id, name: newItemName.trim() };
        setItems((prevItems) => [...prevItems, newItem]);
      }

      // Keep the add form open so user can add more items
      showSnackbar(
        `${dataType === "breed" ? "Breed" : "Rescue type"} added successfully!`,
        "success"
      );
      // Focus the input field for the next item
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      showSnackbar(
        err.message ||
          `Failed to add ${
            dataType === "breed" ? "breed" : "rescue type"
          }. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setEditingItem(null);
    setNewItemName("");
    setIsAdding(false);
    setIsLoading(false);
  };

  const handleModalClose = () => {
    // Only close the modal when explicitly requested
    // Refresh data when modal is closed
    if (dataType === "breed") {
      // Trigger breed refresh in parent component
      setTimeout(() => {
        // This will be handled by the parent component
      }, 100);
    } else if (dataType === "rescueType") {
      // Trigger rescue type refresh in parent component
      setTimeout(() => {
        // This will be handled by the parent component
      }, 100);
    }
    onClose();
  };

  const handleEdit = async () => {
    if (!editingItem || !editingItem.name.trim()) {
      showSnackbar("Please enter a valid name", "error");
      return;
    }

    try {
      setIsLoading(true);
      const result = await onEdit(editingItem.id, editingItem.name.trim());

      // Update the item in local state immediately
      if (result && result.id) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            (item.id || item._id) === editingItem.id
              ? { ...item, name: editingItem.name.trim() }
              : item
          )
        );
      }

      setEditingItem(null);
      showSnackbar(
        `${
          dataType === "breed" ? "Breed" : "Rescue type"
        } updated successfully!`,
        "success"
      );
    } catch (err) {
      showSnackbar(
        err.message ||
          `Failed to update ${
            dataType === "breed" ? "breed" : "rescue type"
          }. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setIsLoading(true);
        const result = await onDelete(id);

        // Remove the item from local state immediately
        if (result) {
          setItems((prevItems) =>
            prevItems.filter((item) => (item.id || item._id) !== id)
          );
        }

        showSnackbar(
          `${
            dataType === "breed" ? "Breed" : "Rescue type"
          } deleted successfully!`,
          "success"
        );
      } catch (err) {
        showSnackbar(
          err.message ||
            `Failed to delete ${
              dataType === "breed" ? "breed" : "rescue type"
            }. Please try again.`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEdit = (item) => {
    setEditingItem({ id: item.id || item._id, name: item.name });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewItemName("");
  };

  // Focus input when add form opens
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // Prevent modal from closing on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Manage {dataType === "breed" ? "Breeds" : "Rescue Types"}
          </h2>
          <button
            onClick={handleModalClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Search Filter */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${
                  dataType === "breed" ? "breeds" : "rescue types"
                }...`}
                className="w-full px-4 py-2 pl-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Add New Item */}
          <div className="mb-6 flex justify-end">
            {!isAdding ? (
              <button
                onClick={() => setIsAdding(true)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <span>+</span>
                <span>
                  Add New {dataType === "breed" ? "Breed" : "Rescue Type"}
                </span>
              </button>
            ) : (
              <div className="bg-gray-50 p-4 w-full rounded-lg">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`Enter ${
                      dataType === "breed" ? "breed" : "rescue type"
                    } name...`}
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && !isLoading && handleAdd()
                    }
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleAdd}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {isLoading ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={cancelAdd}
                    disabled={isLoading}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Current {dataType === "breed" ? "Breeds" : "Rescue Types"} (
              {filteredItems.length} of {items.length})
            </h3>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? `No ${
                      dataType === "breed" ? "breeds" : "rescue types"
                    } match "${searchTerm}"`
                  : `No ${
                      dataType === "breed" ? "breeds" : "rescue types"
                    } found`}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id || item._id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  {editingItem && editingItem.id === (item.id || item._id) ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            name: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === "Enter" && handleEdit()}
                      />
                      <button
                        onClick={handleEdit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md transition-colors text-sm"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-800 flex-1">
                        {item.name}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id || item._id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md transition-colors text-sm"
                        >
                          {isLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleModalClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={5000}
      />
    </div>
  );
};

export default ManageDataModal;
