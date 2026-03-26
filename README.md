# Big-Event

<p align="right">
  🌐 Language: English | <a href="./README.zh-CN.md">Chinese</a>
</p>

## 📌 Project Introduction

**Big-event** is a backend management system built with **Vue2 + Vue Router + Vuex + Element UI + Axios**. It mainly focuses on features such as **user authentication, article category management, article publishing, user profile management, and dashboard data display**.

The project is designed as a content management system, with attention to **complete functions, smooth user experience, clear module structure, and basic coding standards**. During the development, I mainly worked on login and registration, article management, user center features, and some UI and interaction improvements.

## 🚀 1. Project Results Intro

### 1.1 Final Features

The project is completed as a working management system. It includes the following main pages: 

- **Login / Register Page**: supports user sign up, login, and keeping login status.
- **Dashboard**：shows article and comment data with charts using `ECharts`.
- **Article Category Page**: supports adding, editing, and deleting categories.
- **Article List Page**：supports filtering, pagination, deleting, and adding articles.
- **Article Publish Page**: supports rich text editing, cover upload, publishing, and saving drafts.
- **User Center Page**: supports updating profile, uploading avatar, and resetting password.

### 1.2 Features Overview

This project includes the following main features:

- **User Authentication**: supports registration, login, token storage, and route protection.
- **Access Control**: users must log in to access pages, and will be redirected to login if the session expires.
- **Category Management**: supports creating, reading, updating, and deleting article categories.
- **Article Management**: supports article list display, category and status filtering, pagination, deleting, and publishing.
- **Rich Text Editor**: uses `vue-quill-editor` to edit article content.
- **User Profile Management**: supports updating nickname, email, avatar, and password.
- **Data Visualization**: uses `ECharts` on the dashboard to show charts and improve data display.

## 🧩 2. Module Description

### Module 1: **Article Management**

The article management module is the most complete part of the project. It includes three main pages: **Article List, Category Management**, and **Article Publish**.

**Key Points:**

- **Filter and Pagination Together**: the article list supports filtering by category and status, and works with pagination to request data, which improves efficiency.
- **Reusable Form Component**: the article form is built as a separate `article-form` component. It can be used in both a dialog and a full page, which improves reuse.
- **Rich Text and Cover Upload**: supports rich text editing, cover image preview, and submission with `FormData`, similar to real business needs.
- **Draft and Publish States**: one submit method handles both “**publish**” and “save as **draft**”, which reduces repeated code.

**Technical Points:**

- Uses `Promise.all` to request category data and article data at the same time, which reduces loading time.
- Handles different API response formats to improve compatibility.
- Checks rich text content after removing HTML tags to avoid empty submissions.
- Uses `URL.createObjectURL` to preview images locally and releases it when the component is destroyed.

### Module 2: **User Center**

The user center includes three main features: **profile update, avatar upload, and password reset**.

**Key Points:**

- **Route-based Page Switch**: one page handles different features based on the route, which avoids repeated pages.
- **Better Form Validation**: includes rules such as new password must be different, confirm password must match, and email must be valid.
- **Avatar Preview**: users can see the avatar before uploading, which improves user experience.
- **Vuex Data Sync**: user info are stored in Vuex, so the header, sidebar, and user center stay consistent.

**Technical Points:**

- Uses `computed` with route path to control the active tab.
- Uses `watch` to update avatar display when user data changes.
- Stores token in `Vuex` to keep login status after page refresh.

## 🛠 3. Summary of Issues

### 3.1 Problems in the Project

During development, I met several common problems: 

- **API response formats were not consistent**: the data structure was different across endpoints.
- **Login state issues**: such as token being `undefined`, `null`, or having extra prefixes.
- Some duplicate code between article publish and edit features.
- Form and state logic scattered across category management, article management, and user center.

### 3.2 Analysis and Solutions

To solve these problems, I followed a simple way: **first find the cause, then fix it**.

- For inconsistent API data, I created helper methods to extract data, and used Axios response interceptors to handle data in one place.
- For token issues, I added a unified format in local storage, removed invalid values, and cleaned repeated `Bearer` prefixes.
- For duplicate code, I extracted the article form into a reusable component, so different pages can share the same logic.
- For expired login, I handled `401` status in Axios interceptors, cleared the token, and redirected to the login page.

### 3.3 Possible Improvements

The current project works well, but it can be improved further:

- **Make form logic more reusable**: such as using a shared config for different forms.
- **Improve state management**: for example, handle login, logout, and user updates through Vuex actions.
- **Add better UI feedback**: such as loading states, error handling, and empty data display.

### 3.4 Frontend Code Optimization

In this project, I also made several optimizations:

- **Component Reuse**: extracted the article form into a common component.
- **Request Handling**: used interceptors to add token and handle errors and data extracting.
- **State Persistence**: stored token locally and cleaned invalid data.
- **Performance Optimization**: loaded category and article data at the same time to reduce waiting time.
- **Resource Management**: released image preview URL before component destruction to avoid memory waste.
- **Maintainability**: separated default form data, route mapping, vuex, request and storage processing logic to make the code clearer.

## 🔄 4. Handling Requirement Changes

### 4.1 View on Requirement Changes

I think requirement changes are normal in a project. In real work, requirements often change because of user feedback, better understanding, or API updates. Frontend work is not only about building pages. The code should also be **flexible, easy to maintain, and stable**, so it can handle changes better.

### 4.2 Experience from Requirement Changes

From this project, I learned:

- **Use clear naming and structure at the beginning**, or later changes will affect many parts.
- **Avoid strong coupling** between API data, storage logic, request handling, and UI display.
- **Extract common parts** such as shared forms, request handling, and state logic.
- Requirement changes are not the problem. The real problem is code that cannot be extended.

### 4.3 Code Reuse for Better Efficiency

In this project, I learned how code reuse improves efficiency:

- **Reusable Article Form**: I created an `article-form` component with title, category, content editor, cover upload, and submit logic. It can be used in both dialog and full page, which avoids duplicate code.
- **Reusable User Center Page**: profile, avatar, and password features share one page. Different parts are shown based on the route, which reduces repeated work.
- **Reusable Utilities**: token storage, request interceptors, and data handling are written as reusable functions.

My understanding is: **reuse is not only about writing less code, it helps you change one place instead of many places later**.

## 🌱 5. Learning and Growth

### 5.1 Project Experience

After this project, I am not only able to build single pages. I started to understand frontend development from a bigger view, such as **full business flow, module cooperation, API integration, state management, user interaction, and code structure**.

### 5.2 Skills Improvement

This project helped me improve in several areas:

- **Vue2 Development**: I can build small to medium management systems with Vue.
- **Component Design**: I can indentify and find common logic and turn it into reusable components.
- **API Integration**: I can handle requests, authentication, errors, and data differences.
- **Problem Solving**: I can check issues from API, state, routing, and form validation.
- **Code Quality**: I pay more attention to clear structure and easy maintenance.

### 5.3 Areas to Improve

I still need to improve in these areas:

- **Handling complex logic**: I can build features, but the structure can be more clear and better organized.
- **Performance optimization**: I have some basic ideas, but I need more systematic experience.

## 📚 6. Tech Stack

- **Vue 2**
- **Vue Router**
- **Vuex**
- **Element UI**
- **Axios**
- **ECharts**
- **Vue Quill Editor**
- **Less**

## ⚙️ 7. Commands

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

The option `--legacy-peer-deps` ignores some dependency version conflicts, so the project can be installed successfully.

### Run the Project

```bash
npm run serve
```

### Build the Project

```bash
npm run build
```
