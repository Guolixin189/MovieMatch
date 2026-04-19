# CSE 3300 AI Interaction Log

This file records the main AI-assisted prompts used during the development and review of our creative project, MovieMatch.

## Tool Used
- ChatGPT

---

## Entry 1

**Prompt:**  
How should I structure MongoDB models for a MERN movie app where each user can have multiple watchlists and each saved movie needs a watched flag?

**AI Response:**  
The AI suggested creating a `User` model and a `Watchlist` model. It recommended storing an `owner` reference in each watchlist and keeping saved movie objects inside a `movies` array. It also suggested storing a `watched` field on each saved movie object so the watched status could be updated without needing a separate collection.

**What We Used:**  
We used the general structure of a `User` model and a `Watchlist` model and kept `watched` inside the saved movie data.

**What We Changed:**  
We adjusted the exact field names and simplified the structure to better fit our own project.

---

## Entry 2

**Prompt:**  
Help me design Express routes for signup, login, creating watchlists, moving movies between watchlists, deleting movies from a watchlist, and toggling watched status.

**AI Response:**  
The AI suggested separating authentication routes from watchlist routes and protecting private routes with JWT middleware. It also outlined using `POST` for signup/login and create actions, `GET` for retrieving watchlists, `PUT` for watched status updates, and `DELETE` for removal actions.

**What We Used:**  
We used the general route structure and the idea of protecting watchlist-related routes with JWT.

**What We Changed:**  
We changed the route names and implementation details to match our own file structure and app behavior.

---

## Entry 3

**Prompt:**  
What is a clean way to organize a React movie app with pages for login, home, swipe browsing, scroll browsing, watchlists, and a public community page?

**AI Response:**  
The AI suggested splitting the app into separate pages and components instead of keeping everything in one file. It also suggested using React Router for navigation and keeping shared utilities in a separate file.

**What We Used:**  
We used the page-based structure and organized the app into components and pages.

**What We Changed:**  
We changed the naming, layout, and some of the page responsibilities based on how our app developed.

---

## Entry 4

**Prompt:**  
My React frontend can log in, but I need help storing the token and using it for protected API requests. What is a simple pattern for this?

**AI Response:**  
The AI suggested storing the token in localStorage after login and attaching it to outgoing requests using an Axios instance or request interceptor.

**What We Used:**  
We used localStorage to store the token and used an API utility file to attach the token for protected requests.

**What We Changed:**  
We adjusted the implementation to match our backend route paths and the way our project was deployed.

---

## Entry 5

**Prompt:**  
How can I let users create multiple watchlists, rename a watchlist, delete a watchlist, and move movies between watchlists in a MERN app?

**AI Response:**  
The AI suggested separate endpoints for creating, renaming, and deleting watchlists, plus a route for moving a movie from one list to another. It also recommended checking ownership before editing watchlists.

**What We Used:**  
We used the overall CRUD idea for watchlists and the move-movie workflow.

**What We Changed:**  
We rewrote parts of the logic to fit our own route naming and frontend flow.

---

## Entry 6

**Prompt:**  
Please review our MovieMatch project against the rubric and point out which functionality is clearly implemented and which parts still need work.

**AI Response:**  
The AI identified that authentication, TMDB movie fetching, watched status, and public watchlists were already present. It also pointed out missing or weaker areas such as rename/delete watchlist support at that time, incomplete documentation, and some frontend logic that needed to be connected more clearly.

**What We Used:**  
We used this feedback as a final review checklist before submission.

**What We Changed:**  
We added missing watchlist actions and started cleaning up documentation and project files.

---

## Overall Reflection

AI was most useful for:
- planning model structure
- checking backend route patterns
- organizing React pages
- debugging integration issues
- reviewing the project against the rubric

AI was less useful when:
- it assumed too much existing setup
- it suggested code that did not match our exact project
- it gave more abstraction than we needed
