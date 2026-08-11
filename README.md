# Lost Sheep Found

A boutique Christian stationery and gifts storefront inspired by the supplied Lost Sheep Found logo.

## Stack

- Next.js 16.2
- React 19
- TypeScript
- Supabase
- Lucide React

## Local setup

1. Create a NEW Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local`.
4. Add the new Supabase Project URL and Publishable Key.
5. Install packages:

```bash
npm install
```

6. Start:

```bash
npm run dev
```

Open http://localhost:3000.

## Important

Never commit `.env.local`. It is already included in `.gitignore`.

## GitHub

Create a separate repository named `lost-sheep-found`, then:

```bash
git init
git add .
git commit -m "Initial Lost Sheep Found storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lost-sheep-found.git
git push -u origin main
```

> > > > > > > e6171fb (Initial Lost Sheep Found storefront)
