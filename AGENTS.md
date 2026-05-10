# 🧠 CodeCrew — AGENTS.md

## 🚀 Project Overview

CodeCrew is a real-time multiplayer web game designed for programmers, combining collaborative coding with social deduction mechanics inspired by games like Among Us. In each match, players work together to solve a shared coding problem within a limited time, while one or more hidden imposters attempt to sabotage progress without being detected. The goal is to create an engaging platform that blends problem-solving, teamwork, and strategic deception.

---

## 🎯 Core Gameplay

The game consists of 4–8 players per match. Each player is assigned a hidden role at the start of the game: either a **Good Coder** or an **Imposter**. Good Coders collaborate to fix and complete a shared codebase while also solving individual mini coding tasks. Imposters, on the other hand, try to disrupt progress by introducing bugs, misleading teammates, or triggering sabotage actions—all while pretending to contribute. Each game lasts approximately 15–20 minutes.

---

## 🔐 Authentication System

Users should be able to log in using their Google accounts. Upon login, the system should store essential user information such as name, email, profile picture, skill level, and preferred programming language. This data will be used for matchmaking and personalization within the game.

---

## 🏠 Dashboard

After logging in, users are directed to a dashboard where they can access core features of the platform. The dashboard should include options like “Play Game,” “Shop”, and a section displaying user profile details. The UI should be clean, minimal, and consistent with a developer-focused dark theme.

---

## 🎮 Matchmaking System

When a player chooses to play, they must select their skill level (Beginner, Intermediate, or Advanced) and preferred programming language (such as Python, JavaScript, or C++). Based on these inputs, the system should group players into a lobby of 4–8 participants with similar profiles. Once the lobby is full, the game should automatically begin.

---

## 🧠 Game System

At the start of each match, roles are randomly assigned. Typically, one or two players are designated as imposters, while the rest are Good Coders. The game runs on a fixed timer of around 15 minutes. All players participate simultaneously in a shared environment where collaboration and deception take place in real time.

---

## 💻 Coding Environment

The core of the game is a shared code editor. All players can view and edit the same codebase simultaneously, with real-time synchronization handled via Socket.IO. Each game includes a predefined coding problem with a clear description, starter code, and expected output. Players can use a “Run Code” feature to test their progress, which can be simulated or sandboxed in the MVP.

The main code problem must be **large and complex enough for 4–8 players to work on simultaneously**. This means:

* The codebase should be modular (multiple functions/files)
* Different sections can be worked on independently
* Include multiple bugs, incomplete logic, and interconnected components
* Require collaboration (one fix may affect another part)

Example structure of the main problem:

* Multiple functions/modules
* Some parts missing, some incorrect
* Logical dependencies between components

This ensures that all players stay engaged and no one is idle during gameplay.

---

## ✅ Mini Task System

In addition to the main code problem, players receive smaller individual tasks such as fixing bugs, completing functions, or debugging snippets. Successfully completing these tasks contributes to a shared progress bar, helping the team move closer to victory. This system ensures continuous engagement for all players.

---

## 🕵️ Imposter Mechanics

Imposters have special abilities to disrupt gameplay. These include inserting incorrect code into the shared editor, temporarily blurring another player’s screen, sending misleading hints, or introducing artificial delays. To maintain balance, all sabotage actions should have cooldowns and should not overpower the game experience.

---

## 🗳️ Voting & Emergency Meeting System

Players can call an **Emergency Meeting** during the game to discuss suspicious behavior and identify the imposter. During the meeting:

* All players can communicate using the in-game chat
* Players vote to eliminate (kick) one participant
* Voting is anonymous

Outcomes:

* If the imposter is voted out → **Good Coders win immediately**
* If a Good Coder is voted out → the game continues with that player eliminated

This system introduces social deduction and strategy, making communication and observation critical to gameplay.

---

## 💬 In-Game Chat System

A real-time chat system should be implemented where all players can communicate during the game and especially during emergency meetings. Features include:

* Global chat visible to all players
* Real-time messaging using Socket.IO
* Messages tagged with player names
* Optional restriction: limited chat during gameplay, full chat during meetings

This system is essential for coordination, deception, and discussion.

---

## 📊 Game Interface

The main game screen should be divided into clear sections. The shared code editor is placed at the center, with a player list on the left and a task panel on the right. At the top, a progress bar and countdown timer are displayed. Each player can see their own role, but others cannot. The interface should be intuitive and optimized for real-time interaction.

---

## 🏆 Win Conditions

Good Coders win the game if:

* They successfully complete the main coding problem before the timer runs out
* OR they correctly identify and eliminate the imposter via voting

Imposters win if:

* Time runs out before the code is completed
* OR they avoid detection and successfully disrupt progress

The system should clearly display the result at the end of each match.

---

## 🛒 Shop System

The shop is included as a placeholder feature in the MVP. It should display items such as skins, themes, and visual effects, although no backend functionality is required initially. This feature is intended for future monetization and customization.

---

## ⚙️ Real-Time Features

Socket.IO should be used to handle all real-time interactions, including code synchronization, player actions, sabotage events, timer updates, lobby management, chat messages, and voting events. Stability and low latency are critical for a smooth multiplayer experience.

---

## 📁 Project Structure

The project should be organized into separate folders for frontend and backend. The frontend will contain the Next.js application, while the backend will include the Express server and Socket.IO logic. Shared resources such as constants or types can be placed in a common directory if needed.

---

## 📦 Output Expectations

When generating code, ensure that complete files are provided rather than partial snippets. Include the full folder structure, setup instructions, environment variable examples, and clear steps to run the project locally.

---

## 🎨 UI/UX Reference

Use the following video as the primary inspiration for UI/UX design, animations, layout, and overall feel of the game:

[https://youtu.be/sFrKx15_XEM?si=i3u4NNTZOLoUs4oC](https://youtu.be/sFrKx15_XEM?si=i3u4NNTZOLoUs4oC)

The UI/UX of CodeCrew should closely resemble the style shown in this video, including:

* Smooth transitions and animations
* Game-like layout with panels and overlays
* Real-time interaction feedback (typing, updates, effects)
* Minimal but highly interactive design

The final design should feel like a **game first, coding tool second**.
