
import { useState, useEffect } from "react";
import { Board, Column, Task } from "../types/kanban";
import { initialBoard } from "../utils/mockData";
import { toast } from "sonner";

export const useBoard = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial board data
  useEffect(() => {
    setBoard(initialBoard);
    setIsLoading(false);
  }, []);

  // Add new column
  const addColumn = async (title: string): Promise<void> => {
    const newId = `column-${Date.now()}`;
    setBoard(prev => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          id: newId,
          title,
          order: prev.columns.length,
          tasks: []
        }
      ]
    }));
    toast.success("Column added successfully");
  };

  // Add new task
  const addTask = async (columnId: string, title: string): Promise<void> => {
    const newId = `task-${Date.now()}`;
    setBoard(prev => {
      const columnIndex = prev.columns.findIndex(col => col.id === columnId);
      if (columnIndex === -1) return prev;

      const newTasks = [...prev.columns[columnIndex].tasks, {
        id: newId,
        title,
        column_id: columnId,
        order: prev.columns[columnIndex].tasks.length
      }];

      const newColumns = [...prev.columns];
      newColumns[columnIndex] = {
        ...prev.columns[columnIndex],
        tasks: newTasks
      };

      return {
        ...prev,
        columns: newColumns
      };
    });
    toast.success("Task added successfully");
  };

  // Edit task title
  const editTaskTitle = async (taskId: string, newTitle: string): Promise<void> => {
    setBoard(prev => {
      const columnIndex = prev.columns.findIndex(col => 
        col.tasks.some(task => task.id === taskId)
      );
      
      if (columnIndex === -1) return prev;

      const taskIndex = prev.columns[columnIndex].tasks.findIndex(
        task => task.id === taskId
      );
      
      if (taskIndex === -1) return prev;

      const newTasks = [...prev.columns[columnIndex].tasks];
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        title: newTitle
      };

      const newColumns = [...prev.columns];
      newColumns[columnIndex] = {
        ...prev.columns[columnIndex],
        tasks: newTasks
      };

      return {
        ...prev,
        columns: newColumns
      };
    });
    toast.success("Task title updated successfully");
  };

  // Delete task
  const deleteTask = async (taskId: string): Promise<void> => {
    setBoard(prev => {
      const columnIndex = prev.columns.findIndex(col => 
        col.tasks.some(task => task.id === taskId)
      );
      
      if (columnIndex === -1) return prev;

      const newTasks = prev.columns[columnIndex].tasks.filter(
        task => task.id !== taskId
      );

      const newColumns = [...prev.columns];
      newColumns[columnIndex] = {
        ...prev.columns[columnIndex],
        tasks: newTasks
      };

      return {
        ...prev,
        columns: newColumns
      };
    });
    toast.success("Task deleted successfully");
  };

  // Move task between columns
  const moveTask = async (taskId: string, sourceColumnId: string, targetColumnId: string, newIndex: number): Promise<void> => {
    setBoard(prev => {
      const sourceColumnIndex = prev.columns.findIndex(col => col.id === sourceColumnId);
      const targetColumnIndex = prev.columns.findIndex(col => col.id === targetColumnId);
      
      if (sourceColumnIndex === -1 || targetColumnIndex === -1) {
        return prev;
      }

      const sourceColumn = prev.columns[sourceColumnIndex];
      const targetColumn = prev.columns[targetColumnIndex];
      const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return prev;
      }

      // Remove task from source column
      const sourceTasks = [...sourceColumn.tasks];
      const [removedTask] = sourceTasks.splice(taskIndex, 1);

      // Add task to target column at new index
      const targetTasks = [...targetColumn.tasks];
      targetTasks.splice(newIndex, 0, { ...removedTask, column_id: targetColumnId });

      // Create new columns array
      const newColumns = [...prev.columns];
      newColumns[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
      newColumns[targetColumnIndex] = { ...targetColumn, tasks: targetTasks };

      return {
        ...prev,
        columns: newColumns
      };
    });
    toast.success("Task moved successfully");
  };

  // Reorder columns
  const moveColumn = async (sourceIndex: number, targetIndex: number): Promise<void> => {
    setBoard(prev => {
      const columns = [...prev.columns];
      const [removed] = columns.splice(sourceIndex, 1);
      columns.splice(targetIndex, 0, removed);

      // Update order
      columns.forEach((column, index) => {
        column.order = index;
      });

      return {
        ...prev,
        columns: columns
      };
    });
    toast.success("Columns reordered successfully");
  };

  return {
    board,
    isLoading,
    error,
    addColumn,
    addTask,
    moveTask,
    moveColumn,
    editTaskTitle,
    deleteTask
  };
};
