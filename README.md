# 2AI Conference — React + Supabase

Static **React (Vite)** frontend and **Supabase** (Postgres + Edge Functions). Configure and deploy using **`SUPABASE.md`**.

### Payment flow (high level)

```mermaid
flowchart LR
  A["Registration form"] --> B["sessionStorage pendingRegistration"]
  B --> C["Edge: create-payment-order"]
  C --> D["Qfix payment"]
  D --> E["/payment-callback page"]
  E --> F["Edge: verify-payment"]
  F --> G["Edge: register"]
  G --> H["/registration-success"]
```

### Local dev

```bash
cp .env.example .env   # add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```
