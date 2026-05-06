# Habit-Vision Hub: Design Specification

## 1. Understanding Summary
*   **Purpose**: A productivity system that bridges high-level "Vision" (Goals) with daily "Execution" (Habits).
*   **Core Workflow**: Goals are broken down into recurring Habits. 
*   **Progression**: Habits follow a 30-day "Challenge" phase before becoming permanent "Mastery" tracks.
*   **The Forgiveness Mechanic**: A gamified "Life Heart" system allows users to recover broken streaks.
*   **Layout**: A "Split View" dashboard with Daily Actions on top and the Vision Hub below.

## 2. Decision Log
| Decision | Selection | Rationale |
| :--- | :--- | :--- |
| **Data Model** | Event-Log Model | Allows for rich history tracking and activity heatmaps. |
| **Streak Logic** | Consecutive Logs | Most reliable way to track consistency; supports "Heart" gaps. |
| **Habit Cycle** | Hybrid (30-day + Ongoing) | Balances short-term excitement with long-term discipline. |
| **UI Aesthetic** | Playful Minimalist | Focuses on clarity, micro-animations, and high-quality typography. |

## 3. Technical Architecture

### Database Schema (Migrations)
*   **`users`**: Add `hearts_count` (int).
*   **`habits`**: 
    *   `title` (string)
    *   `goal_id` (foreignId)
    *   `frequency` (json/string - daily/weekly)
    *   `target_days` (int - default 30)
    *   `status` (enum: challenge, mastered, archived)
*   **`habit_logs`**:
    *   `habit_id` (foreignId)
    *   `logged_at` (date)
    *   `type` (enum: completion, heart_used)

### API Endpoints (Laravel)
*   `POST /habits/{habit}/log`: Record a daily completion.
*   `POST /habits/{habit}/recover`: Use a heart to fix a missed day.
*   `GET /dashboard/stats`: Returns streaks, upcoming challenges, and heart count.

### Frontend Components (React + Inertia)
*   `ActionShelf`: Horizontal habit tracker with "Punch" interaction.
*   `VisionCard`: Progress bar for the 30-day challenge + linked habits.
*   `HeartIndicator`: Global count of available recovery items.

## 4. Assumptions & Constraints
*   **Streaks**: A streak is considered "active" if there is a log for today OR yesterday (to account for different time zones/logging times).
*   **Mastery**: Once a 30-day challenge is met, the habit "levels up" the parent Goal's progress.
*   **Aesthetics**: Must use Inter font and Lucide icons for consistency.
