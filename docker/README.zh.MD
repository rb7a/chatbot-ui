# 如何使用 Docker Compose 在本地部署 Chatbot-UI

本指南将带您完成使用 Docker Compose 和自托管 Supabase 实例在本地搭建 Chatbot-UI 的过程。内容涵盖了环境安全、环境变量配置、服务运行、数据库迁移及可选的迁移 SQL 文件调整等步骤。

---

## 目录

1. [前置条件](#prerequisites)
2. [服务安全加固](#securing-your-services)
3. [环境变量配置](#environment-variable-configuration)
4. [可选：更新迁移 SQL 文件](#optional-update-migration-sql-file)
5. [部署步骤](#deployment-steps)
6. [访问 Chatbot-UI](#accessing-chatbot-ui)
7. [注意事项](#notes)

---

## 前置条件

- 已在您的机器上安装 **Docker** 和 **Docker Compose**。
- 具备基本的环境变量和服务器配置知识。

---

## 服务安全加固

> **重要提示：**  
> 生产环境切勿使用默认或示例密钥。务必自行生成安全的凭证。

更多细节请参阅 [官方 Supabase Docker 指南](https://supabase.com/docs/guides/self-hosting/docker)。

请按照以下步骤确保您的环境安全：

- **JWT 密钥：**  
  - 生成一个安全的、随机的 40 字符密钥。  
  - 妥善保存此密钥——不要泄露或提交到版本控制。
- **API 密钥：**  
  - 使用您的 JWT 密钥生成新的 anon 和 service API 密钥。
  - 在 `.env` 文件中更新以下内容：
    - `ANON_KEY`
    - `SERVICE_ROLE_KEY`
- **其他密钥：**  
  - 编辑 `.env` 并设置以下内容：
    - `POSTGRES_PASSWORD`（Postgres 角色密码）
    - `JWT_SECRET`（PostgREST、GoTrue 等使用）
    - `SITE_URL`（您的站点基础 URL）
    - `SMTP_*`（邮件服务器凭证）
    - `POOLER_TENANT_ID`（Supavisor pooler 租户 ID）
- **Dashboard 认证：**  
  - 更改 `.env` 中的默认 Dashboard 用户名和密码：
    - `DASHBOARD_USERNAME`
    - `DASHBOARD_PASSWORD`

**每次更新密钥后，务必重启所有服务以使更改生效。**

更多信息请参阅 [服务安全加固](https://supabase.com/docs/guides/self-hosting/docker#securing-your-services)。

---

## 环境变量配置

1. **复制环境变量模板**

   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**

   - 按上述说明，将所有占位符替换为您自己的安全密钥和配置信息。

3. **配置 Chatbot-UI 的环境变量**

   编辑 Chatbot-UI 的环境变量文件（`.env`），如下所示：

   ```
   NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://<your-server-ip>:8000
   NEXT_PUBLIC_SUPABASE_SERVER_URL=http://<your-server-ip>:8000
   ```

   > 请将 `<your-server-ip>` 替换为您的实际服务器 IP 地址或域名。

   **示例：**

   ```
   NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://192.168.1.100:8000
   NEXT_PUBLIC_SUPABASE_SERVER_URL=http://192.168.1.100:8000
   ```

---

## 可选：更新迁移 SQL 文件

在运行数据库迁移前，您可能需要将 `supabase/migrations/20240108234540_setup.sql` 文件中的以下行更新为您的部署信息：

```sql
  project_url TEXT := 'http://kong:8000';
  service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3NDQ5MDU2MDAsCiAgImV4cCI6IDE5MDI2NzIwMDAKfQ.RB5XU7Y4BzKf0Usb-8oBnXqbT86Gqj77TNCBf3EH-_U';
```

**修改为：**

```sql
  project_url TEXT := 'http://<your-server-ip>:8000';
  service_role_key TEXT := '<your-actual-service-role-key>';
```

- `<your-server-ip>` 替换为您的实际服务器 IP 或域名。
- `<your-actual-service-role-key>` 替换为您 `.env` 文件中的 `SERVICE_ROLE_KEY` 值。

**注意：**  
请确保这些值与您的环境变量和部署配置一致，以避免权限或连接问题。

---

## 部署步骤

1. **确保所有环境变量均已按上述配置。**

2. **启动 Supabase 和 Chatbot-UI 服务**

   ```bash
   docker compose up -d
   ```

3. **为 Chatbot-UI 执行数据库迁移**

   ```bash
   docker exec -it supabase-db /supabase/execute_migrations.sh
   ```

---

## 访问 Chatbot-UI

在浏览器中输入：

```
http://<your-server-ip>:3000
```

例如：

```
http://192.168.1.100:3000
```

此时 Chatbot-UI 应已在本地运行。

---

## 注意事项

- 始终妥善保管您的密钥，切勿公开泄露。
- 生产环境建议采取更多安全加固措施。
- 若更改了任何密钥或配置，请务必重启所有相关服务。
- 进阶配置与故障排查请参考 [Supabase 官方文档](https://supabase.com/docs)。

---