# Blog Application Backend API Documentation

## Overview
This backend powers a full-stack blog platform with user roles (Reader, Writer, Admin), blog post management, comments, likes, bookmarks, and admin analytics. All endpoints return JSON. Authentication uses JWT in the `Authorization: Bearer <token>` header.

---

## Authentication

### Register
- **POST** `/api/auth/register`
- **Body:** `{ username, email, password, role? }`
- **Response:** `201 Created` or error

### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ token }`

### Get Current User
- **GET** `/api/auth/me`
- **Auth:** Required
- **Response:** User object (no password)

### Update Profile
- **PUT** `/api/auth/me`
- **Auth:** Required
- **Body:** `{ username?, email?, bio?, avatar? }`
- **Response:** Updated user object

---

## Blog Posts

### List Blogs
- **GET** `/api/blogs`
- **Query:** `page`, `limit`, `search`, `tag`, `category`, `author`
- **Response:** `{ blogs: [...], total }`

### Get Blog by Slug
- **GET** `/api/blogs/:slug`
- **Response:** Blog object with populated author and comments

### Create Blog
- **POST** `/api/blogs`
- **Auth:** Writer/Admin
- **Body:** `title`, `content`, `tags`, `category`, `status`, `slug?`, `image?` (multipart)
- **Response:** Created blog

### Update Blog
- **PUT** `/api/blogs/:id`
- **Auth:** Owner/Admin
- **Body:** Any updatable fields
- **Response:** Updated blog

### Delete Blog
- **DELETE** `/api/blogs/:id`
- **Auth:** Owner/Admin
- **Response:** Success message

### Like/Unlike Blog
- **POST** `/api/blogs/:id/like`
- **Auth:** Required
- **Response:** `{ likes: number }`

### Bookmark/Unbookmark Blog
- **POST** `/api/blogs/:id/bookmark`
- **Auth:** Required
- **Response:** `{ bookmarks: [blogId, ...] }`

---

## Comments

### List Comments
- **GET** `/api/comments?blogId=...`
- **Response:** Array of comments for a blog

### Add Comment
- **POST** `/api/comments`
- **Auth:** Required
- **Body:** `{ content, blogId }`
- **Response:** Created comment

### Edit Comment
- **PUT** `/api/comments/:id`
- **Auth:** Owner
- **Body:** `{ content }`
- **Response:** Updated comment

### Delete Comment
- **DELETE** `/api/comments/:id`
- **Auth:** Owner/Admin
- **Response:** Success message

---

## Users (Admin)

### List Users
- **GET** `/api/admin/users`
- **Auth:** Admin
- **Response:** Array of users

### Change User Role
- **PATCH** `/api/admin/users/:id/role`
- **Auth:** Admin
- **Body:** `{ role }`
- **Response:** Updated user

### Ban/Unban User
- **PATCH** `/api/admin/users/:id/ban`
- **Auth:** Admin
- **Response:** `{ message }`

---

## Analytics (Admin)

### Get Analytics
- **GET** `/api/admin/analytics`
- **Auth:** Admin
- **Response:** `{ users, posts, comments, activeUsers }`

---

## Error Handling
- All errors return `{ error: "message" }` with appropriate HTTP status codes.

## Security
- All sensitive endpoints require JWT authentication.
- Passwords are hashed with bcrypt.
- Role-based access enforced for all protected routes.

## Notes
- All endpoints return JSON.
- For file uploads (images), use `multipart/form-data`.
- Pagination defaults: `page=1`, `limit=10`.
- Slugs are auto-generated from titles if not provided.

---

For further details, see the code or contact the development team.
