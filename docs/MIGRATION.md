# Hexo → Astro · Migration Runbook

This document tracks the structural change of the blog from Hexo to Astro,
including the multi-platform deployment setup (GitHub Pages + Cloudflare Pages).

## Final architecture

```
nhexo    ── preserved, read-only history. NOT deployed anywhere.
master   ── RETIRED after rename to `main`.
main     ── NEW production branch.
           ├── GH Pages (static) — auto-built by .github/workflows/deploy-gh-pages.yml
           └── Cloudflare Pages (dynamic / SSR) — connected directly via CF Dashboard.
astro-dev── Working / writing branch.
           └── Cloudflare Pages Preview — auto per-PR.
```

## Phase 0 · Pre-flight

Verify the current state before touching anything.

```bash
# Confirm repo / default branch / Pages flag
curl -s https://api.github.com/repos/Jvcon/jvcon.github.io | jq '{default_branch, has_pages, pushed_at}'

# Check current local branches
git branch -a

# Confirm what Pages is currently serving
# (Settings → Pages, requires browser login):
# https://github.com/Jvcon/jvcon.github.io/settings/pages
```

Expected starting state:
- `has_pages: true`
- `default_branch: master`
- Pages source ≈ "Deploy from a branch" → `master` `/ (root)` (Hexo legacy)

## Phase 1 · Rename master → main

> Done ONCE. After this, `master` no longer exists, all PRs default to `main`.

### Option A · GitHub CLI + PAT (preferred)

Requires PAT with `repo` scope.

```bash
echo "$GH_PAT" | gh auth login --with-token
gh api -X POST repos/Jvcon/jvcon.github.io/branches/master/rename \
  -f new_name=main

# Change the default branch (if not auto-switched by rename)
gh repo edit Jvcon/jvcon.github.io --default-branch main
```

### Option B · Browser UI

1. Settings → Branches → Default branch → switch to `main` (creates `main` from main… no, that's circular; instead:)
2. Use the branch rename flow: Settings → General → "Rename branch" button next to `master`.
3. Confirm `main` is now the default branch.

### Local follow-up

```bash
git fetch origin
git branch -m master main                  # rename local tracking
git branch -u origin/main main             # reset upstream
git remote set-head origin main            # update origin/HEAD
```

## Phase 2 · Switch Pages source to GitHub Actions

> Browser-only. The API supports `PUT /pages` but the **first** enable still
> needs a click because GH must show the "Approve workflow run" gate.

1. Browser → https://github.com/Jvcon/jvcon.github.io/settings/pages
2. **Build and deployment → Source** → select **"GitHub Actions"**.
3. GH will show a yellow warning: "Workflows don't have permission to deploy yet".
   This is expected — it gets cleared after the first successful workflow run.

## Phase 3 · Add the deploy workflow

Already created at `.github/workflows/deploy-gh-pages.yml`.

Triggered by:
- push to `main`
- manual `workflow_dispatch`

Outputs:
- Static site to `./dist` (Astro default + Pagefind index, already wired in `package.json`).
- Deploys via `actions/deploy-pages@v4` to the `github-pages` environment.

### First run

1. Commit & push the workflow file to `main`.
3. Open the first workflow run → GH shows a new deployment trying to publish into
   `github-pages` environment, blocked behind "Review required".
3. Click **"Approve and deploy"** (only needed once; subsequent runs auto-deploy).
4. After ~30–60 s the site should be live at `https://jvcon.github.io/`
   (or your custom domain if CNAME is set).

## Phase 4 · Cloudflare Pages setup (dynamic / SSR)

> Done in CF Dashboard. No wrangler.toml needed for Pages-managed deploys.

### Pre-work (optional, only if you actually want SSR)

For a static-only mirror this step is a no-op. For real dynamic rendering:

```bash
npm install @astrojs/cloudflare
```

In `astro.config.mjs`:

```js
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // Either "server" (full SSR) or "hybrid" (default static, opt-in per route).
  output: "hybrid",
  adapter: cloudflare(),
  // ...rest unchanged
});
```

Mark any page dynamic with:

```astro
---
export const prerender = false;
---
```

### Dashboard steps

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**.
2. **Connect to Git** → pick `Jvcon/jvcon.github.io`.
3. **Build settings**:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: *(leave empty)*
   - Environment variables: as needed (none required for static).
4. **Production branch**: `main`
5. **Preview branches**: `astro-dev` and any PR
6. Save & deploy. First build takes ~2–3 min.

CF gives you a free `*.pages.dev` URL immediately. Custom domain binding is
done later in **Custom domains** tab (see Phase 6).

## Phase 5 · Cleanup

After everything is green:

- [ ] Old `nhexo` branch — keep as archive, optionally set to **read-only**
      via branch protection (Settings → Branches → Add rule → Branch name
      pattern `nhexo`, restrict pushes).
- [ ] `master` — already gone after Phase 1; confirm with
      `git ls-remote origin master` → should return empty.
- [ ] Remove stale Pages env vars / secrets that were only used by Hexo.

## Phase 6 · Domain `blog.ques.fun` (deferred — discuss separately)

Not covered in this runbook. When ready:

1. Decide canonical host (GH Pages or Cloudflare).
2. Add DNS records at the registrar per the chosen target.
3. If GH Pages: drop a `public/CNAME` containing `blog.ques.fun` so the build
   output carries it; the next deploy will pick it up automatically.
4. If Cloudflare Pages: add the domain under **Custom domains** in the Pages
   project; CF auto-provisions the certificate.
5. Once the new host serves `blog.ques.fun`, switch the existing GH Pages
   custom-domain setting (if any) off so traffic isn't split.

## Rollback plan

If the new Astro build is broken in a way GH Pages can't recover from:

1. Settings → Pages → Source → switch back to "Deploy from a branch" → `master`.
2. Restore `master` from a known-good SHA:

   ```bash
   git push origin <good-sha>:refs/heads/master --force
   ```

The Hexo artifacts on `master` are still there; this gets you back to the old
site within seconds.

`nhexo` is untouched throughout — it remains a permanent history of the
original Hexo content (markdown files preserved as-is).