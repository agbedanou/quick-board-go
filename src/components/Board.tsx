import React, { useState, useCallback } from 'react';
import { Board as BoardType } from "../types/kanban";
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragOverEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import Column from "./Column";
import Card from "./Card";
import SortableColumn from "./SortableColumn";

interface BoardProps {
  board: BoardType;
  onAddColumn: (title: string) => Promise<void>;
  onAddTask: (columnId: string, title: string) => Promise<void>;
  onEditTaskTitle: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onMoveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => Promise<void>;
  onMoveColumn: (sourceIndex: number, targetIndex: number) => Promise<void>;
}

const Board: React.FC<BoardProps> = ({ 
  board,
  onAddColumn,
  onAddTask,
  onEditTaskTitle,
  onDeleteTask,
  onMoveTask,
  onMoveColumn
}) => {
  const [newColumnTitle, setNewColumnTitle] = React.useState("");
  const [isAddingColumn, setIsAddingColumn] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5
      }
    }),
    useSensor(TouchSensor)
  );

  const handleAddColumn = async () => {
    if (newColumnTitle.trim()) {
      await onAddColumn(newColumnTitle.trim());
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const getActiveTask = () => {
    return board.columns.flatMap(col => col.tasks).find(task => task.id === activeTaskId);
  };

  const getActiveColumn = () => {
    return board.columns.find(col => col.id === activeColumnId);
  };

  const handleAddTask = async (columnId: string, title: string) => {
    await onAddTask(columnId, title);
  };

  const handleEditTaskTitle = async (taskId: string, newTitle: string) => {
    await onEditTaskTitle(taskId, newTitle);
  };

  const handleDeleteTask = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTaskId(active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = getActiveTask();
    const targetColumn = board.columns.find(col => col.id === over.id);

    if (!activeTask || !targetColumn) return;

    await onMoveTask(activeTask.id, activeTask.column_id, targetColumn.id, targetColumn.tasks.length);
    setActiveTaskId(null);
  };

  const handleColumnDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const sourceIndex = board.columns.findIndex(col => col.id === active.id);
    const targetIndex = board.columns.findIndex(col => col.id === over.id);

    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      await onMoveColumn(sourceIndex, targetIndex);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button
          onClick={() => setIsAddingColumn(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Column
        </button>
      </div>

      {isAddingColumn && (
        <div className="mb-6">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddColumn()}
            className="border-2 border-blue-500 p-2 rounded w-64"
            placeholder="Enter column title..."
            autoFocus
          />
          <button
            onClick={handleAddColumn}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingColumn(false)}
            className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {board.columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.tasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                <SortableColumn
                  column={column}
                  onAddTask={(title: string) => handleAddTask(column.id, title)}
                  onEditTaskTitle={handleEditTaskTitle}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTaskId && (
            <Card
              task={getActiveTask() || { id: '', title: '', column_id: '', order: 0 }}
              onEditTitle={handleEditTaskTitle}
              onDelete={handleDeleteTask}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
