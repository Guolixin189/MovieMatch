[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GCBfbKeb)

# CSE3300 Creative Project

Lixin Guo 525626 Section02 Guolixin189  
Nachuan Ding 605549 Section02 dingn0823

## Project Link

**Live Demo:** https://movie-match-eight-omega.vercel.app/

**Backend API:** https://moviematch-7156.onrender.com

## Overview

MovieMatch is a full-stack movie discovery and organization web application built with MongoDB, Express, React, and Node.js. The app uses the TMDB API to fetch real movie data and lets users create accounts, browse movies, save movies they like, and organize them into watchlists.

Users can explore movies in two different ways: a swipe-style card view and a traditional scrolling view. Saved movies can be added to custom watchlists, removed later, or marked as watched. Users can also publish a watchlist to the public channel so other users can browse it and like it.

Our goal for this project was to build a more interactive and visual movie browsing website.

## Technologies Used

- React
- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication
- TMDB API
- Tailwind CSS

## Core Features

### Authentication

- Users can sign up for a new account
- Users can log in and log out
- Passwords are stored securely using hashing
- JWT is used for protected routes

### Watchlists

- Each new user automatically gets a default watchlist
- Users can create multiple watchlists
- Users can rename watchlists
- Users can delete watchlists
- Users can add movies to a watchlist
- Users can remove movies from a watchlist
- Users can move movies between watchlists
- Users can mark saved movies as watched

### Movie Discovery

- The app fetches and displays real movie data from the TMDB API
- Users can choose to browse movies in a swipe-style view
- Users can also browse movies in a traditional scrolling view
- The home page lets users search movie with preferences such as title keyword, genre, rating, and release year before choosing a browsing mode

### Community Features

- Users can publish a watchlist to the public channel
- Other users can browse public watchlists
- Other users can like published watchlists

## Database Design

The project stores data in MongoDB using Mongoose models.

### User

- id
- username
- password

### Watchlist

- id
- name
- owner
- movies
- isPublic
- likes

### Movie data stored in a watchlist

- id
- title
- poster_path
- overview
- release_date
- vote_average
- watched

This allows the database to store users, watchlists, saved movie IDs, and watched status as required by the rubric.

## Creative Portion

1. Tinder-Style Swipe UI for Movie Discovery
   To make browsing movies more interesting and engaging, we introduced the Tinder-Style Swipe mode for movie discovery.
   Instead of displaying a list of movies, the interface presents a single movie card at a time. This card presents the movie poster, click to flip the card to show the movie's information such as title, year, director, etc.
   The system limits the user's primary action to a binary choice: accept (right/save) or reject (left/skip).

2. Public Channel
   The Public Channel transforms the application from a private utility into a community-driven discovery platform. It allows users to voluntarily publish their personal watchlists to a public channel, where other registered users can browse, interact with (like), and draw inspiration from them.
   By default, all watchlists are private. Users have the control to toggle a specific list's visibility to "public", then this watchlist will appear in the public channel.
   The public channel aggregates all public watchlists. This feed dynamically populates the list owner's username, the list title, and the embedded movie data, typically sorted by recent activity.
   Users can interact with published lists by "liking" them. The system records the interacting user's unique identifier to ensure each user can only like a specific list once.

# AI Reflection

## Before Coding

### What is the goal of this assignment?

The goal of this assignment was to build a complete full-stack creative project using the technologies from class. For our group, that meant making a movie web app with a React frontend, a Node/Express backend, and MongoDB for persistent storage. We also wanted the project to feel more interactive than a very basic CRUD app, so we focused on movie discovery, watchlist management, and a public sharing feature.

### When will you use AI, and when will you avoid it?

We used AI mostly for brainstorming, debugging, and checking the overall structure of our code. It was useful when we needed help thinking through backend routes, MongoDB model design, and frontend component organization. We tried not to use AI as a substitute for understanding the code ourselves. If a suggestion did not match our project or we did not fully understand it, we checked it and adjusted it before using it.

### What conceptual questions did you ask the AI?

We asked conceptual questions about:

- how to structure MongoDB data for users and watchlists
- how JWT authentication should work in an Express app
- how to organize React components for multiple pages
- how to store watched status for movies inside a watchlist
- how frontend actions should connect to backend CRUD routes

## During Development

### Paste your three most useful AI prompts.

1. **How should I structure MongoDB models for a MERN movie app where each user can have multiple watchlists and each saved movie needs a watched flag?**

2. **Help me design Express routes for signup, login, creating watchlists, moving movies between watchlists, and toggling watched status.**

3. **What is a clean way to organize a React movie app with pages for login, home, swipe browsing, scroll browsing, watchlists, and a public community page?**

### What was the AI’s response? (Summarize.)

For the database design question, the AI suggested using separate models for users and watchlists, with watchlists storing an owner reference and an array of saved movie objects. That matched what we needed and gave us a good starting point.

For the backend route question, the AI suggested separating authentication routes from watchlist-related routes and protecting private actions with JWT middleware. It also helped outline which routes should be GET, POST, PUT, and DELETE.

For the React structure question, the AI suggested splitting the app into reusable pages and components instead of putting everything into one file. That helped us organize the project more clearly and connect features one at a time.

### What did you change in the AI’s output, and why?

We changed a lot of naming and structure details. The AI’s first suggestions were more generic, so we adjusted them to match our actual app and coding style. For example, we changed field names, route names, and component layout to fit our own project. We also simplified some suggestions because the AI sometimes proposed more abstraction than we really needed for a class project.

We also tested suggestions before using them. In several places, the AI gave code that was close to what we needed but not directly usable in our project, so we rewrote parts of it instead of copying it exactly.

### What worked and what did not? (Be specific.)

What worked:

- brainstorming database structure
- checking route patterns for CRUD features
- thinking through JWT authentication flow
- organizing the React pages and components
- debugging smaller syntax and connection issues

What did not work as well:

- sometimes the AI suggested code that did not match our exact file structure
- some responses assumed extra setup that we were not using
- some frontend suggestions looked clean in theory but did not fit our current state management
- AI suggestions still needed manual testing, especially for backend/frontend integration

## After Completion

### What errors did the AI make that you caught?

The AI sometimes suggested route handlers or frontend logic that did not match our actual state or model fields. It also sometimes assumed that a helper function or setup already existed when it did not. In a few places, the generated code was too broad or too polished for our actual project structure, so we had to simplify it.

### What debugging or testing did you do?

We tested signup and login through the UI, checked whether JWT-protected routes worked after logging in, and verified that users could create watchlists, add movies, move movies, remove movies, and mark movies as watched. We also checked MongoDB to make sure the stored data matched what the frontend showed. During debugging, we used browser dev tools, console logs, and server logs to track errors between frontend requests and backend responses.

### What did you understand better because of the AI?

Using AI helped us understand the connection between the frontend and backend more clearly, especially how a single action in React should map to a route in Express and then to a MongoDB update. It also helped reinforce how JWT protection, model relationships, and CRUD routes fit together in a larger project instead of only in smaller examples.

### What would you change about how you use AI next time?

Next time, we would probably use AI earlier for planning and structure, but be stricter about keeping a cleaner log of prompts and responses as we go. We would also spend less time trying to adapt overly complicated AI suggestions and instead ask narrower, more specific questions.

### Submit your AI Interaction Log

Our AI interaction log is included in `CSE_3300_AI_LOG.md`.

## Rubric

Approved by Cheng

### Rubric turned in on time (5 points)

- 5 - Checked by TA

### Languages/Frameworks used (30 points)

- 10 - Learned/Used React frontend
- 10 - Learned/Used Node/Express backend
- 10 - Learned/Used MongoDB database

### Functionality (40 points)

- 5 - Users can register, login, and logout
- 5 - Users can create, rename, and delete multiple watchlists
- 5 - Users can add and remove movies from watchlists
- 5 - Users can mark saved movies as watched
- 10 - Fetches and displays real movie data from TMDB API
- 10 - Database correctly stores users, watchlists, saved movie IDs, and watched status

### Creative Portion (20 points)

### Best Practices (5 points)

- 3 - Code is readable and well-formatted
- 2 - All pages pass the HTML validator
