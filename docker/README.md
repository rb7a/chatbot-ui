# How to Deploy Chatbot-UI Locally with Docker Compose

This guide walks you through setting up Chatbot-UI locally using Docker Compose and a self-hosted Supabase instance. It covers securing your environment, updating secrets, running migrations, and configuring environment variables.

For more details, refer to the [official Supabase Docker guide](https://supabase.com/docs/guides/hosting/docker).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Securing Your Services](#securing-your-services)
3. [Deployment Steps](#deployment-steps)
4. [Accessing Chatbot-UI](#accessing-chatbot-ui)
5. [Notes](#notes)

---

## Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- Basic knowledge of environment variables and server configuration.

---

## Securing Your Services

> **Important:**  
> Never use default or sample secrets in production. Always generate your own secure credentials.

Follow these steps to secure your setup:

### 1. Generate and Update Secrets

- **JWT Secret:**  
  - Obtain a secure, random 40-character secret.  
  - Store this secret securely—do not share or commit it to version control.
- **API Keys:**  
  - Use your JWT secret to generate new anon and service API keys.
  - Update the following in your `./docker/.env` file:
    - `ANON_KEY`
    - `SERVICE_ROLE_KEY`
- **Other Secrets:**  
  - Edit `./docker/.env` and set:
    - `POSTGRES_PASSWORD` (Postgres role password)
    - `JWT_SECRET` (used by PostgREST, GoTrue, etc.)
    - `SITE_URL` (your site’s base URL)
    - `SMTP_*` (mail server credentials)
    - `POOLER_TENANT_ID` (Supavisor pooler tenant ID)
- **Dashboard Authentication:**  
  - Change the default dashboard username and password in `./docker/.env`:
    - `DASHBOARD_USERNAME`
    - `DASHBOARD_PASSWORD`

**After updating any secrets, always restart all services to apply changes.**

For more information, see [Securing Your Services](https://supabase.com/docs/guides/self-hosting/docker#securing-your-services).

---

## Deployment Steps

### 1. Start Supabase Services

```bash
docker compose up -d
```

### 2. Run Database Migrations for Chatbot-UI

```bash
docker exec -it supabase-db /supabase/execute_migrations.sh
```

### 3. Configure Environment Variables

Edit your environment variables as follows:

- `NEXT_PUBLIC_SUPABASE_PUBLIC_URL`
- `NEXT_PUBLIC_SUPABASE_SERVER_URL`

> **Note:**  
> Replace `<your-server-ip>` with your actual server’s IP address or domain name.

**Example:**

```
NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://<your-server-ip>:8000
NEXT_PUBLIC_SUPABASE_SERVER_URL=http://<your-server-ip>:8000
```

For a local server at `192.168.1.100`:

```
NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://192.168.1.100:8000
NEXT_PUBLIC_SUPABASE_SERVER_URL=http://192.168.1.100:8000
```

---

## Accessing Chatbot-UI

Open your browser and navigate to:

```
http://<your-server-ip>:3000
```

For example:

```
http://192.168.1.100:3000
```

Chatbot-UI should now be running locally.

---

## Notes

- Always keep your secrets safe and never expose them publicly.
- For production deployments, further hardening and security measures are recommended.
- Refer to the [Supabase documentation](https://supabase.com/docs) for advanced configuration.

---