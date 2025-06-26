export const SWAGGER_DESCRIPTION = `
# Blog APIs Documentation

## Overview
A robust and scalable RESTful API for a blogging platform built with **NestJS**, **TypeScript**, and **MySQL**. This API demonstrates modern backend development practices with clean architecture, comprehensive authentication, and flexible service integrations.

##  Key Features
- **User Authentication & Authorization** - JWT-based auth with email verification
- **Blog Management** - Create, read, update, and delete blog posts (public/private)
- **Comment System** - Users can comment on public blogs
- **Social Features** - Follow/unfollow users and like blog posts
- **File Upload** - Profile picture uploads with multiple storage providers
- **Email Integration** - Verification emails and password reset functionality

##  Tech Stack
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MySQL with TypeORM
- **Authentication:** JWT
- **File Upload:** Cloudinary (configurable)
- **Email:** Multiple providers (Brevo, SendGrid, Mailtrap)
- **Validation:** class-validator & class-transformer

##  Architecture Highlights
This project showcases interesting architectural patterns:
- **Factory Pattern Email System** - Flexible email system that switches between providers based on environment
- **Provider-Agnostic Upload Module** - Designed to easily support different storage solutions
- **Clean Architecture** - Well-organized modules with clear separation of concerns

##  Authentication Flow
1. **Register** - Create a new user account
2. **Email Verification** - Verify email with OTP
3. **Login** - Authenticate and receive JWT token
4. **Authorized Requests** - Use JWT token in Authorization header

##  Getting Started
1. **Base URL:** \`http://localhost:3000\` (development)
2. **Authentication:** Include JWT token in Authorization header: \`Bearer <your-token>\`
3. **Content-Type:** 
   - \`application/json\` for standard API requests
   - \`multipart/form-data\` for any request (supported for all endpoints)
4. **Testing:** Use the "Authorize" button above to set your JWT token for all requests

##  Quick Links
- **GitHub Repository:** [Blog-APIs](https://github.com/MohamedAboElnaser/Blog-apis)
- **Database Seeding:** Run \`npm run seed\` for sample data
- **Docker Setup:** Available with docker-compose for easy deployment

`;
