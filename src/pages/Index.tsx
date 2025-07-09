
import React from "react";
import Board from "../components/Board";
import Header from "../components/Header";
import { useBoard } from "../hooks/useBoard";

const Index: React.FC = () => {
  const { 
    board, 
    isLoading, 
    error,
    addColumn,
    addTask,
    editTaskTitle,
    deleteTask,
    moveTask,
    moveColumn
  } = useBoard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading board data...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500">Error loading board: {error}</p>
          </div>
        ) : (
          <Board
            board={board}
            onAddColumn={addColumn}
            onAddTask={addTask}
            onEditTaskTitle={editTaskTitle}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onMoveColumn={moveColumn}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow overflow-hidden">
        <Board
          board={board}
          onAddColumn={addColumn}
          onAddTask={addTask}
          onEditTaskTitle={editTaskTitle}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
          onMoveColumn={moveColumn}
        />
      </main>
    </div>
  );
};

export default Index;
