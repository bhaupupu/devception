# Render Deployment Checklist

## Target URLs

- Vercel frontend: `https://devception.vercel.app`
- Render backend service name: `devception`
- Expected Render backend URL: `https://devception.onrender.com`
- Old Railway backend: `https://devception.up.railway.app`

## Current Blocker

The current MongoDB URI uses Railway private networking:

```text
mongodb://mongo:<password>@mongodb.railway.internal:27017
```

That host is only reachable from services running inside Railway. Render will not be able to connect to `mongodb.railway.internal`.

Use one of these before switching traffic:

- Move MongoDB to MongoDB Atlas and use the Atlas connection string.
- Add a public Railway TCP proxy for MongoDB, then use the public proxy connection string.
- Migrate persistence to Supabase/Postgres in a later migration.

Do not put real secrets into this file.

## Render Environment Variables

Set these in the Render dashboard for the `devception` web service:

```env
NODE_ENV=production
MONGODB_URI=<public MongoDB connection string>
NEXTAUTH_SECRET=<same value used in Vercel>
CLIENT_ORIGIN=https://devception.vercel.app
CLIENT_ORIGINS=https://devception.vercel.app,http://localhost:3000
ALLOW_VERCEL_PREVIEWS=false
IMPOSTER_BUG_COOLDOWN_MS=45000
IMPOSTER_BLUR_COOLDOWN_MS=60000
IMPOSTER_HINT_COOLDOWN_MS=30000
GAME_DURATION_MS=900000
MEETING_DISCUSSION_MS=60000
MEETING_VOTING_MS=30000
MAX_PLAYERS=8
MIN_PLAYERS=4
```

Render supplies `PORT` automatically.

## Vercel Environment Variables After Render Is Healthy

Only change these after `https://devception.onrender.com/health` returns OK:

```env
NEXT_PUBLIC_SOCKET_URL=https://devception.onrender.com
NEXT_PUBLIC_API_URL=https://devception.onrender.com/api
```

Keep these as-is:

```env
NEXTAUTH_URL=https://devception.vercel.app
NEXTAUTH_SECRET=<same value used in Render>
GOOGLE_CLIENT_ID=<existing value>
GOOGLE_CLIENT_SECRET=<existing value>
```

## Cutover Steps

1. Push the repo changes.
2. Create a Render Blueprint from `render.yaml`.
3. Add the Render secret environment variables.
4. Deploy the `devception` backend.
5. Visit `https://devception.onrender.com/health`.
6. Update Vercel `NEXT_PUBLIC_SOCKET_URL` and `NEXT_PUBLIC_API_URL`.
7. Redeploy Vercel.
8. Test login, profile, room creation, lobby, Socket.IO connection, chat, editor sync, tasks, and game results.

## Rollback

Restore the Vercel backend URLs:

```env
NEXT_PUBLIC_SOCKET_URL=https://devception.up.railway.app
NEXT_PUBLIC_API_URL=https://devception.up.railway.app/api
```

Redeploy Vercel. Keep Railway running until the Render deployment has been verified.
