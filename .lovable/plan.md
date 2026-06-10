# Salt v2 — Full Backend Build

## 1. Enable Lovable Cloud
Provisions Postgres, Auth, Storage, server functions. No external accounts.

## 2. Database schema (migrations)
```text
profiles         (id=auth.users, username, discord_id, created_at)
user_roles       (user_id, role: 'admin'|'user')  -- separate table, prevents privilege escalation
keys             (key TEXT PK, tier '24h'|'week'|'month'|'perm', hwid, ip, user_id?, expires_at, revoked, created_at, source 'ad'|'paid'|'admin')
bans             (id, type 'ip'|'hwid', value, reason, banned_at, expires_at?, banned_by)
ip_logs          (id, ip, hwid?, path, ua, created_at)
ad_sessions      (token PK, ip, created_at, consumed_at?, key_issued?)
```
All RLS-enabled. Admin policies via `has_role(auth.uid(),'admin')` security-definer fn.

## 3. Server functions / routes
- `POST /api/public/validate` (header `X-Salt-Secret`) → body `{key, hwid, ip}` → `{valid, tier, expires_at, reason}`. Binds HWID on first use, rejects if HWID/IP banned.
- `POST /api/public/ad-callback` → claims ad token, generates 24h key bound to IP+HWID.
- `GET /key-success` route → shows the generated key once.
- `checkBanStatus` server fn (called by root) → if visitor IP/HWID banned, route to `/banned`.
- `logVisitor` middleware → writes to `ip_logs`.
- Admin server fns: `listKeys`, `generateKey(tier,count)`, `revokeKey`, `listBans`, `addBan`, `removeBan`, `listLogs`, `listUsers`, `promoteAdmin`.
- `POST /api/chat` → AI SDK streaming chat with Lovable AI (Gemini Flash), system prompt about Salt.

## 4. Frontend additions
- `/auth` — email+password login/signup (uses Lovable Cloud auth).
- `/_authenticated/admin` — admin layout (role-gated), with tabs: Keys, Bans, Logs, Users.
- `/dashboard` — wire to real user: show their keys, account info, theme switcher (keep).
- `/get-key` — wire "Linkvertise"/"Lootlabs" buttons to create ad session → redirect to gateway URL placeholder → on return hit `/key-success`.
- `/banned` — fetch real ban reason from server using fingerprint.
- Chatbot widget — floating button on every page, opens chat panel, streams Lovable AI.

## 5. Secrets
- `SALT_API_SECRET` (you'll set — shared secret for C# validator calls)
- `LOVABLE_API_KEY` (auto, for chatbot)
- Linkvertise/Lootlabs callback URLs are placeholders you wire to a token in `ad_sessions`.

## 6. Out of scope (v3)
- Real Spotify integration (still mock widget on /info)
- Real payment processing (UI stays mock)
- Email-based password reset flow polish

## What I need from you after this ships
1. Sign up at `/auth` — tell me the email, I'll mark it admin via SQL.
2. Set `SALT_API_SECRET` when prompted.
3. Paste Linkvertise/Lootlabs callback URL format when ready.

Approve and I'll execute steps 1–4 in order.
