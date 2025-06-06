# 💬 Realtime Group Chat App

A fullstack real-time group chat application that supports private and group messaging, media file sharing, and AWS-powered cloud storage. Built with Node.js, Express, MySQL, and Socket.IO.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 📬 Real-time messaging using Socket.IO
- 🧑‍🤝‍🧑 Create, join, and exit group chats
- 🔒 Private chat visibility per group
- 🖼️ Share images, videos, and text messages
- ☁️ File storage and access via AWS S3
- 🧹 Weekly auto-archiving of old chats using Cron Jobs

---

## 🛠️ Tech Stack

| Category       | Tools / Libraries                        |
|----------------|-------------------------------------------|
| **Backend**    | Node.js, Express.js                      |
| **Realtime**   | Socket.IO                                |
| **Database**   | MySQL, Sequelize ORM                     |
| **Storage**    | AWS S3                                   |
| **Auth**       | JWT (JSON Web Token)                     |
| **File Upload**| Multer                                   |
| **Scheduling** | node-cron                                |

---

## 🧠 Learnings

- Built a scalable messaging system with group-based socket channels  
- Designed AWS-integrated file handling workflows  
- Practiced schema design and message retention strategies  
- Improved real-world backend skills including auth, security, and cloud deployment

---

## 📂 Folder Structure

```bash
GroupChatApp/
├── controllers/
├── models/
├── routes/
├── utils/
├── uploads/             # temporary local files
├── s3/                  # AWS S3 config & methods
├── config/
├── cron/                # scheduled jobs
├── index.js
