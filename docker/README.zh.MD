

# 如何使用 Docker Compose 本地部署 Chatbot-UI

本指南将带您完成通过 Docker Compose 和自托管 Supabase 实例，在本地部署 Chatbot-UI 的全部流程。内容包括环境安全加固、密钥更新、数据库迁移和环境变量配置。

详细说明请参考 [Supabase 官方 Docker 指南](https://supabase.com/docs/guides/hosting/docker)。

---

## 目录

1. [前置条件](#前置条件)
2. [服务安全加固](#服务安全加固)
3. [部署步骤](#部署步骤)
4. [访问 Chatbot-UI](#访问-chatbot-ui)
5. [注意事项](#注意事项)

---

## 前置条件

- 您的机器需已安装 **Docker** 和 **Docker Compose**
- 具备环境变量和服务器配置的基础知识

---

## 服务安全加固

> **重要提示：**  
> 切勿在生产环境中使用默认或示例密钥，请务必生成并使用您自己的安全凭据。

请按以下步骤操作：

### 1. 生成并更新密钥

- **JWT Secret：**  
  - 生成一个安全的、随机的 40 位密钥  
  - 妥善保存此密钥，切勿公开或提交到版本控制
- **API 密钥：**  
  - 使用您的 JWT Secret 生成新的 anon 和 service API 密钥
  - 在 `./docker/.env` 文件中更新以下项：
    - `ANON_KEY`
    - `SERVICE_ROLE_KEY`
- **其他密钥：**  
  - 编辑 `./docker/.env`，设置以下内容：
    - `POSTGRES_PASSWORD`（Postgres 角色密码）
    - `JWT_SECRET`（PostgREST、GoTrue 等服务使用）
    - `SITE_URL`（您的站点基础 URL）
    - `SMTP_*`（邮件服务器凭据）
    - `POOLER_TENANT_ID`（Supavisor pooler 的租户 ID）
- **Dashboard 登录认证：**  
  - 修改 `./docker/.env` 中的默认 Dashboard 用户名和密码：
    - `DASHBOARD_USERNAME`
    - `DASHBOARD_PASSWORD`

**每次更新密钥后，请务必重启所有服务以使更改生效。**

更多信息请参考 [服务安全加固](https://supabase.com/docs/guides/self-hosting/docker#securing-your-services)。

---

## 部署步骤

### 1. 启动 Supabase 服务

```bash
docker compose up -d
```

### 2. 执行 Chatbot-UI 数据库迁移

```bash
docker exec -it supabase-db /supabase/execute_migrations.sh
```

### 3. 配置环境变量

请按如下方式编辑您的环境变量：

- `NEXT_PUBLIC_SUPABASE_PUBLIC_URL`
- `NEXT_PUBLIC_SUPABASE_SERVER_URL`

> **注意：**  
> 请将 `<your-server-ip>` 替换为您实际的服务器 IP 地址或域名。

**示例：**

```
NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://<your-server-ip>:8000
NEXT_PUBLIC_SUPABASE_SERVER_URL=http://<your-server-ip>:8000
```

若服务器 IP 为 `192.168.1.100`，则：

```
NEXT_PUBLIC_SUPABASE_PUBLIC_URL=http://192.168.1.100:8000
NEXT_PUBLIC_SUPABASE_SERVER_URL=http://192.168.1.100:8000
```

---

## 访问 Chatbot-UI

在浏览器中访问：

```
http://<your-server-ip>:3000
```

例如：

```
http://192.168.1.100:3000
```

此时，您应该可以在本地使用 Chatbot-UI。

---

## 注意事项

- 请务必妥善保管密钥，切勿泄露到公共渠道
- 生产环境建议进一步加强安全措施
- 高级配置请参考 [Supabase 文档](https://supabase.com/docs)

---