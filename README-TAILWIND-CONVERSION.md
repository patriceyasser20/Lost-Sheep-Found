# Tailwind conversion notes

Drop these files into your existing project at the same paths (they replace
the versions that used the `globals.css` custom classes). No component logic,
state, or imports were changed — only `className` values.

## 1. Add Tailwind to your project

If Tailwind isn't already installed:

```bash
npm install -D tailwindcss postcss autoprefixer
```

Add to `package.json` devDependencies if not already there:
```
"tailwindcss": "^3.4.10",
"postcss": "^8.4.39",
"autoprefixer": "^10.4.19"
```

## 2. Files included here

- `tailwind.config.ts` — color tokens (paper, paper-light, cream, brown,
  brown-soft, gold, line) and font families (display, sans) matching your
  original CSS variables exactly.
- `postcss.config.js`
- `app/globals.css` — now just the three `@tailwind` directives plus a small
  `@layer base` for global resets (smooth scroll, link color/underline reset,
  heading font, `<em>` italics inside headings, selection color). Everything
  else moved into per-component utility classes.
- All the component and page files you sent, converted.

## 3. Things worth knowing

- Ornamental shapes (the arch frame around the hero logo, the oval frame
  inside product placeholders) use Tailwind's arbitrary-property syntax,
  e.g. `[border-radius:48%_48%_3%_3%/34%_34%_3%_3%]`, since those elliptical
  corner radii aren't expressible as standard utilities. This keeps them as
  real Tailwind classes rather than pulling in a separate CSS file.
- Colors that were `rgba(76,60,46,X)` etc. in the original map exactly to
  your brand colors with opacity modifiers (e.g. `bg-brown/45`,
  `border-brown/[.12]`), since those rgb values are your brown/cream/gold
  hexes decoded.
- `next/font` variables (`--font-display`, `--font-sans`) still get set in
  your `layout.tsx` the same way as before — Tailwind just reads them via
  the `font-display` / `font-sans` utility classes now instead of the old
  CSS `var()` references.
- I only converted the files you uploaded. Anything else in your project
  still using the old class names (`.site-header`, `.product-card`, etc.)
  will need the same treatment — happy to keep going through the rest.
