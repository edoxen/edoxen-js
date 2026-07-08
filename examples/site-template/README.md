# Edoxen Site Template

A working starting point for building a resolutions browser site with
the Edoxen data layer. Clone this, add your data, customize the theme,
deploy.

## What you get

- Home page with resolution list, search, year filter, stats
- Meetings page with timeline + venue filters
- Resolution detail page with considerations/actions/approvals
- Meeting detail page with agenda + linked resolutions
- About page with committee info + Edoxen format docs
- Dark mode support
- Responsive layout
- SSG (static site generation) via vite-ssg
- Sitemap + robots.txt generation

## What you provide

### Data (`data/` directory)

```
data/
  decisions/          ← Edoxen YAML decision collections
    plenary-2024.yaml
    plenary-2023.yaml
    ...
  committee.yaml      ← MeetingSeries fixture (committee metadata)
```

### Config (`edoxen.config.ts`)

```typescript
export default {
  // Where your data lives
  dataDirs: {
    decisions: './data/decisions',
  },
  // Where the build output goes
  outputDir: './public/data',
  // Site URL (for sitemap)
  siteUrl: 'https://your-org.github.io/your-repo/',
  // Base path (for GitHub Pages subpaths)
  basePath: '/your-repo/',
}
```

### Customization

- **Colors**: override CSS custom properties in `src/styles/theme.css`
- **Logos**: drop SVGs into `public/`
- **Social links**: edit `_data/committee.yaml`
- **Additional pages**: add Markdown/AsciiDoc to `content/`

## Quick start

```bash
# Clone the template
npx degit edoxen/edoxen-js/examples/site-template my-site
cd my-site

# Install
pnpm install

# Add your data
mkdir -p data/decisions
cp /path/to/your/fixtures/*.yaml data/decisions/

# Edit committee metadata
vim data/committee.yaml

# Dev server
pnpm dev

# Build for production
pnpm build
```

## Architecture

```
my-site/
├── data/
│   ├── decisions/        ← your YAML fixtures (data)
│   └── committee.yaml    ← committee metadata (data)
├── content/              ← additional pages (optional)
├── public/               ← static assets (logos, favicons)
├── src/
│   ├── views/            ← page templates (customize freely)
│   ├── router/           ← route config
│   └── styles/           ← theme overrides
├── edoxen.config.ts      ← site config
├── vite.config.ts        ← vite + vite-ssg config
└── tailwind.config.js    ← tailwind theme
```

All composables, data transforms, URN helpers, search, i18n, and
contact utilities come from `@edoxen/edoxen` and `@edoxen/vue`. You
only customize the views and provide data.

## License

BSD-2-Clause
