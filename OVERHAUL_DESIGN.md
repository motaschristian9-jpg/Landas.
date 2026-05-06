# Product Overhaul Design: The Three Pillars

## 1. Understanding Summary
- **Project:** Bantay/Landas Productivity Hub.
- **Core Problem:** Current logic is "messy" and confusing regarding how Tasks, Habits, and Goals relate.
- **Solution:** A "Three Pillar" system where Tasks, Habits, and Goals are independent but share a common gamification layer.
- **Key Constraints:** Preserve existing premium UI/UX (animations, fonts, nav); use "Smart Streaks"; keep Goal Milestones separate from the To-Do list.

## 2. The Three Pillars
### Pillar 1: To-Do (Tasks)
- Standard CRUD for daily/one-off items.
- Features categories, priorities, and due dates.
- Independence: Not linked to Goals or Habits.

### Pillar 2: Habit Tracker
- Recurring actions with frequency (Daily/Weekly/Custom Days).
- **Smart Streaks:** Streaks only break if a *scheduled* day is missed.
- Visual GitHub-style contribution grid.

### Pillar 3: Goal Management
- Long-term projects with internal **Milestones** (separate from the To-Do list).
- Percentage-based progress tracking.

## 3. The "Brain" (Service-Oriented Architecture)
- **HabitService:** Handles streak calculations and scheduling logic.
- **GoalService:** Manages milestone progress and goal health.
- **GamificationService:** Awards XP and manages Badge unlocks.
- **SuggestionService:** Provides heuristic-based "Smart Suggestions" to the user.

## 4. Gamification (Vanity System)
- **XP:** Earned by completing any pillar item.
- **Levels:** Purely for vanity/pride.
- **Badges:** Unlockable achievements for specific milestones (e.g., "7-day Streak", "Early Bird").

## 5. Decision Log
| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| Relationship | Three Independent Pillars | Simplifies logic and prevents UI clutter. |
| Goal Items | Separated Milestones | Keeps the To-Do list focused on daily errands. |
| Streak Logic | Smart Streaks | More motivating; doesn't punish users for "rest days." |
| Reward Style | Vanity/Badges | Focuses on intrinsic motivation and "completionist" pride. |
| Architecture | Service-Oriented | Centralizes logic for easier maintenance and future AI expansion. |
