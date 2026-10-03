# Switchboard

Every project in one place, three live at a time, one next step each.

Switchboard is a personal organizer for someone running many projects at once. It is not a to-do list. It answers two questions: where does each project stand, and which three get my time this week.

## The rules

- **One row per project.** Each has a stage, the date it was last touched, and exactly one next step.
- **Three active slots,** shared across every area. To switch a project on when the slots are full, you park another first.
- **Always-on areas.** School and Commitments have deadlines you don't control, so their projects never take a slot.
- **Stale flag.** A live project untouched for 14 days is flagged, so you either do the next step or park it on purpose.
- **Did it** stamps the project as touched today and clears the next step, so you have to write a new one.

These numbers live in `src/lib/areas.ts`.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

```bash
pnpm build       # production build
pnpm lint
```

## How it's put together

Next.js (App Router), React, TypeScript, Tailwind, Tiptap for the note editor.

```
src/
  app/
    layout.tsx        fonts, theme boot script, metadata (SEO, Open Graph, Twitter)
    page.tsx          renders <Switchboard /> plus JSON-LD structured data
    project/[id]/     a project's page: its controls and its notes
    note/[id]/        a note
    manifest.ts       web app manifest (name, icons, standalone display)
    opengraph-image.tsx  1200×630 share image, built at build time
    robots.ts, sitemap.ts
    favicon.ico, icon.svg, apple-icon.png
    globals.css       colour tokens for light and dark, area colours, shared pieces
  components/
    Switchboard.tsx   top level: tabs and current view; the tab lives in ?tab=
    PageShell.tsx     page frame and header, shared by every page
    Home.tsx          headline, the three slots, deadlines, area tiles
    SlotCard.tsx      one live project
    ComingUp.tsx      deadlines, with add and remove
    AreaView.tsx      one area's projects
    ProjectCard.tsx   one project: name, next step, stage, live switch
    ProjectControls.tsx  next step, stage and live switch, shared by card and page
    ProjectPage.tsx   /project/[id]
    NotePage.tsx      /note/[id]
    NoteEditor.tsx    the Tiptap editor: toolbar, Markdown shortcuts, autosave
    NoteList.tsx      a Notes section: New note and the list
    BackLink.tsx      back through history, or to the parent page
  lib/
    types.ts          Project, Deadline, Board
    areas.ts          the areas, stages and the rules' numbers
    store.ts          the board: every read and write goes through here
    notes.ts          notes, same pattern, own storage key
    nav.ts            whether Back has somewhere in the app to go
    derive.ts         stale, upcoming deadlines, counts
    dates.ts          date maths and labels
    seed.ts           first-run data
    theme.ts          light and dark mode
    site.ts           name, copy and URL shared by metadata and the share image
public/
  icon-*.png          PWA icons (regular and maskable)
  brand/              logo files: icon, mark and wordmark, SVG and PNG, dark and white
supabase/
  schema.sql          tables for the hosted database (not wired up yet)
```

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the production URL (e.g. `https://switchboard.example.com`). Canonical links, Open Graph URLs, `robots.txt` and the sitemap are built from it. On Vercel it falls back to the production domain automatically; elsewhere it falls back to `http://localhost:3000`.

## Where the data lives right now

In the browser's local storage, on the device you're using. That means:

- It survives reloads and restarts.
- It does **not** sync between your phone and your PC yet.
- Clearing site data for the app wipes it.

The board and the notes are saved under separate keys (`switchboard:board:v1` and `switchboard:notes:v1`). A note belongs to one project or one area. Deleting a project deletes its notes.

On first run the board is filled from `src/lib/seed.ts`. After that, the saved board wins and the seed is ignored. To start over from the seed, clear the site's local storage.

## What's next

1. **Sync.** Create a Supabase project, run `supabase/schema.sql`, add sign-in, and replace `load` and `save` in `src/lib/store.ts` with database calls. The three-slot rule is already enforced in the schema.
2. **Offline shell.** Add a service worker (Serwist) so the app opens instantly once installed. The manifest and icons are already in place.
3. **Stale reminders.** A push notification when a live project crosses 14 days.
