# Kanban Board – Product Requirements Document (PRD)

## Overview

A single-board Kanban-style task manager with a clean, modern UI and smooth drag-and-drop interactions. The application will be built using **Vite**, **dnd-kit**, **Supabase** for backend storage, and **Tailwind CSS** for styling.

---

## Goals

- Allow users to manage tasks in a single Kanban board without authentication.
- Support basic CRUD operations for columns and cards.
- Provide smooth, intuitive drag-and-drop functionality.
- Store all data persistently via Supabase.
- Ensure a responsive and mobile-friendly design.

---

## Tech Stack

- **Frontend:** Vite + React
- **Drag and Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Styling:** Tailwind CSS
- **Backend/Storage:** Supabase (Database only)
- **Hosting:** TBD (e.g., Vercel, Netlify)

---

## Features

### 1. Columns
- Display multiple columns (default: "To Do", "In Progress", "Done")
- Add new columns
- Rename existing columns
- Delete columns (with confirmation)
- Reorder columns via drag-and-drop

### 2. Cards
- Display task cards within columns
- Add new cards to any column
- Edit card titles in-place
- Delete cards
- Reorder cards within a column
- Move cards between columns via drag-and-drop

### 3. Drag & Drop
- Smooth and accessible drag-and-drop interactions
- Visual indicators for drag state (e.g., shadow, highlight)

### 4. Storage
- All data (columns and cards) saved and loaded via Supabase
- Real-time sync is **not required**

### 5. Design & UX
- Responsive layout for mobile and desktop
- Clean, modern aesthetic
- Smooth UI transitions

---

## Non-Goals

- Multi-board support
- User accounts or authentication
- Real-time collaboration
- Card metadata (e.g., due dates, labels)

---

## Data Model

### Columns Table
| Field       | Type       | Notes                  |
|-------------|------------|------------------------|
| `id`        | UUID       | Primary key            |
| `title`     | Text       | Column name            |
| `order`     | Integer    | Position in the board  |
| `created_at`| Timestamp  | Auto-generated         |

### Cards Table
| Field       | Type       | Notes                        |
|-------------|------------|------------------------------|
| `id`        | UUID       | Primary key                  |
| `column_id` | UUID       | Foreign key to `columns.id`  |
| `title`     | Text       | Card title                   |
| `order`     | Integer    | Position within the column   |
| `created_at`| Timestamp  | Auto-generated               |

