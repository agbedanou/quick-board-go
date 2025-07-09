import React from "react";
import { Column } from "../types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";

interface SortableColumnProps {
  column: Column;
  onAddTask: (title: string) => Promise<void>;
  onEditTaskTitle: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const SortableColumn: React.FC<SortableColumnProps> = ({
  column,
  onAddTask,
  onEditTaskTitle,
  onDeleteTask
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    isSorting,
  } = useSortable({ id: column.id });

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const handleEditTaskTitle = async (taskId: string, newTitle: string) => {
    await onEditTaskTitle(taskId, newTitle);
  };

  const handleDeleteTask = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        min-w-[280px] 
        bg-white 
        rounded-lg 
        shadow-md 
        p-4 
        space-y-4 
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{
        transform: CSS.Transform.toString({
          x: isDragging ? 10 : 0,
          y: isDragging ? 10 : 0,
        }),
        transition: 'transform 0.2s ease-in-out'
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{column.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>

      {isAddingTask && (
        <div className="space-y-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter task title..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingTask(false)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {column.tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            onEditTitle={handleEditTaskTitle}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default SortableColumn;
