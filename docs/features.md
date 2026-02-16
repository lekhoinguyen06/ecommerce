# 🛒 Ecommerce Application

## 🧱 Stack

- **NestJS** (Express)
- **Prisma** (PostgreSQL)

## 🔐 Authentication & Authorization

- **JWT-based authentication**
  - `accessToken` (stateless)
  - `refreshToken` (stateful)

#### Capabilities

- Manual sign-in
- API key authentication
- Latent token revocation (of `refreshToken` since `accessToken` is stateless and cannot be revoked)
- Device count tracking

## ✨ Cool Stuff

- `envConfig` service with strong typing & validation
- Email service using **Resend** + **react-email**
- Auth parameter decorator supporting optional auth guards
