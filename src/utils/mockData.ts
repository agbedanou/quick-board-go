import { Board, Column, Task } from "../types/kanban";

export const initialBoard: Board = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      order: 0,
      tasks: [
        {
          id: "task-1",
          title: "Research user requirements",
          column_id: "todo",
          order: 0
        },
        {
          id: "task-2",
          title: "Create wireframes",
          column_id: "todo",
          order: 1
        },
        {
          id: "task-3",
          title: "Design UI components",
          column_id: "todo",
          order: 2
        }
      ]
    },
    {
      id: "in-progress",
      title: "In Progress",
      order: 1,
      tasks: [
        {
          id: "task-4",
          title: "Implement drag and drop",
          column_id: "in-progress",
          order: 0
        },
        {
          id: "task-5",
          title: "Add column management",
          column_id: "in-progress",
          order: 1
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      order: 2,
      tasks: [
        {
          id: "task-6",
          title: "Set up project",
          column_id: "done",
          order: 0
        },
        {
          id: "task-7",
          title: "Configure CI/CD pipeline",
          column_id: "done",
          order: 1
        },
        {
          id: "task-8",
          title: "Install dependencies",
          column_id: "done",
          order: 2
        }
      ]
    }
  ]
};
