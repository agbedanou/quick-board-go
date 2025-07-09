
import React, { useState } from "react";
import { Task } from "../types/kanban";

interface CardProps {
  task: Task;
  onEditTitle: (taskId: string, title: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const Card: React.FC<CardProps> = ({ task, onEditTitle, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleEditTitle = async () => {
    if (newTitle.trim() && newTitle !== task.title) {
      await onEditTitle(task.id, newTitle);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
  };

  return (
    <div
      data-task-id={task.id}
      data-column-id={task.column_id}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleEditTitle()}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter task title..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleEditTitle}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
