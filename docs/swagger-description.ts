export const SWAGGER_DESCRIPTION = `
# Blog APIs Documentation

## Overview
A robust and scalable RESTful API for a blogging platform built with **NestJS**, **TypeScript**, and **MySQL**. This API demonstrates modern backend development practices with clean architecture, comprehensive authentication, and flexible service integrations.

##  Key Features
- **User Authentication & Authorization** - JWT-based auth with email verification and refresh token support
- **Blog Management** - Create, read, update, and delete blog posts (public/private)
- **Comment System** - Users can comment on public blogs
- **Social Features** - Follow/unfollow users and like blog posts
- **File Upload** - Profile picture uploads with multiple storage providers
- **Email Integration** - Verification emails and password reset functionality

##  Tech Stack
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MySQL with TypeORM
- **Authentication:** JWT with refresh tokens
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
3. **Login** - Authenticate and receive JWT access token + HTTP-only refresh token cookie
4. **Authorized Requests** - Use JWT token in Authorization header
5. **Token Refresh** - Automatically refresh expired access tokens using secure refresh token

##  Token Management
- **Access Token:** Short-lived JWT token sent in response body (used for API authentication)
- **Refresh Token:** Long-lived token stored in secure HTTP-only cookie (used to refresh access tokens)
- **Cookie Security:** HTTP-only, Secure (HTTPS in production), with configurable expiration

##  Getting Started
1. **Base URL:** \`http://localhost:3000\` (development)
2. **Authentication:** Include JWT token in Authorization header: \`Bearer <your-token>\`
3. **Content-Type:** 
   - \`application/json\` for standard API requests
   - \`multipart/form-data\` for any request (supported for all endpoints)
4. **Testing:** Use the "Authorize" button to set your JWT token for all requests
5. **Token Refresh:** Call \`/auth/refresh-token\` when access token expires

##  Quick Links
- **GitHub Repository:** [Blog-APIs](https://github.com/MohamedAboElnaser/Blog-apis)
- **Database Seeding:** Run \`npm run seed\` for sample data
- **Docker Setup:** Available with docker-compose for easy deployment

`;
