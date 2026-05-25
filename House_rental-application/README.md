# House Rent App (MERN Stack).

This project is a **House Rent App** built with the **MERN stack** (MongoDB, Express, React, Node.js). It is designed to manage and streamline the process of renting properties. The application supports three types of users:

- **Admin**: Manages users, properties, and bookings.
- **Owner**: Adds, edits, and manages properties.
- **Renter**: Views properties and books them.

## Features

### **For Renters**
- **Account Creation & Login**: Renters can sign up and log in using their email and password.
- **View Properties**: Renters can view a list of available properties.
- **Get Information**: By clicking on a property, Renters can view detailed information about the property and the owner.
- **Send Booking Request**: Renters can fill out a form to request a property.
- **Booking Status**: Renters can track the status of their booking. The status will initially show as "Pending" and will be updated by the property owner.

### **For Admin**
- **User Management**: Admin can approve users as **Owner** to allow them to list properties.
- **Property & Booking Management**: Admin can view all properties and manage bookings.

### **For Owners**
- **Account Activation**: Owners must first be approved by Admin before they can list properties.
- **Property Management**: After approval, Owners can perform CRUD operations on properties (Create, Read, Update, Delete).
- **Availability & Status**: Owners can update the availability and status of their properties.

## Getting Started

### Prerequisites
- **Node.js** (preferably LTS version)
- **MongoDB** (you can use MongoDB locally or with a cloud service like MongoDB Atlas)

### Setup Instructions

#### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git   https://github.com/gerawerk/house-rental-system.git
```
#### Step 2: Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
#### Run the following commands
```bash
npm install
npm start
```
The backend will run on http://localhost:8000 as per configuration.
#### Step 3: Frontend Setup
#### Navigate to the frontend directory:
```bash
cd frontend
```
#### Run the following commands
```bash
npm install
npm start
```
The frontend will run on http://localhost:3000 by default.

### Technologies Used
- Frontend: React.js, Material UI, Axios
- Backend: Node.js, Express, MongoDB
- Authentication: JWT (JSON Web Token) for user authentication
- State Management: React hooks (useState, useEffect)
