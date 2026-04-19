# Brazos — Official Design System & Color Tokens

> Source of truth for developers and designers. All tokens below are pulled directly from the production code (`expo/constants/theme.ts`, `expo/components/FloatingCategoryBar.tsx`, and the customer home screen). Use these exact values — do not approximate.

---

## 1. Brand Core — Evergreen Palette

The Brazos primary identity color is **Evergreen**. It anchors the entire system: headers, primary CTAs, featured cards, and the "Welcome to Brazos" hero gradient.

| Token           | Hex       | RGB              | Usage                                                          |
| --------------- | --------- | ---------------- | -------------------------------------------------------------- |
| `primary`       | `#145A4A` | `20, 90, 74`     | Primary brand color. Buttons, icons, headings, active states.  |
| `primaryLight`  | `#0E3F34` | `14, 63, 52`     | Mid-stop for gradients, pressed button states.                 |
| `primaryDark`   | `#0C362C` | `12, 54, 44`     | Deep shadow-tier; dark backgrounds, featured surfaces.         |
| `primaryDeep`   | `#0A2D25` | `10, 45, 37`     | Darkest stop. End of hero gradients, overlays on imagery.      |
| `text` (deep)   | `#0E2E32` | `14, 46, 50`     | Primary body text — evergreen-tinted near-black.               |

### Evergreen Gradient (Signature "Welcome to Brazos" banner)
```
linear-gradient(135deg, #145A4A 0%, #0E3F34 50%, #0A2D25 100%)
```
- Angle: 135° (top-left → bottom-right)
- Stops: `0%`, `50%`, `100%`
- React Native: `start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}`

---

## 2. Accent — Brazos Gold

Gold is the secondary brand accent. Used for CTAs on dark backgrounds, "See all" links, active pagination dots, and the Refer & Earn banner.

| Token         | Hex       | RGB              | Usage                                               |
| ------------- | --------- | ---------------- | --------------------------------------------------- |
| `accent`      | `#C9A84C` | `201, 168, 76`   | Primary accent. CTAs on dark, links, featured pill. |
| `accentLight` | `#D4BA6A` | `212, 186, 106`  | Hover/pressed light tint, subtle highlights.        |
| `accentDark`  | `#A8893D` | `168, 137, 61`   | Pressed state, borders on gold surfaces.            |

### Gold Gradient ("Refer & Earn" banner)
```
linear-gradient(135deg, #8A6A1F 0%, #A6842B 50%, #C8A84B 100%)
```
- Companion accent text color: `#FFE9A8` (cream, for icons/labels on gradient)

---

## 3. Coral / Red — Trending Accent

Used for the "Trending Now" promotional banner and the **Beauty** category.

| Token           | Hex       | RGB              | Usage                                          |
| --------------- | --------- | ---------------- | ---------------------------------------------- |
| `trendingDeep`  | `#7A2E2E` | `122, 46, 46`    | Start stop of trending gradient.               |
| `trendingMid`   | `#A34343` | `163, 67, 67`    | Middle stop.                                   |
| `trendingBright`| `#C95858` | `201, 88, 88`    | End stop. Also the **Beauty** category color.  |
| `trendingTint`  | `#FFD9D9` | `255, 217, 217`  | Icon/label tint on trending gradient.          |

### Trending Gradient
```
linear-gradient(135deg, #7A2E2E 0%, #A34343 50%, #C95858 100%)
```

---

## 4. Category Colors (Floating Circular Buttons)

Each of the four home categories has a dedicated hue. These are used as the filled background for the floating circular icon buttons with **white icons** (inverted for pop).

| Category | Hex       | RGB             | Role                             |
| -------- | --------- | --------------- | -------------------------------- |
| Home     | `#2D6A8F` | `45, 106, 143`  | Steel blue — Home services       |
| Beauty   | `#C95858` | `201, 88, 88`   | Coral red — Beauty services      |
| Health   | `#2D8A5A` | `45, 138, 90`   | Emerald — Health & wellness      |
| Chef     | `#C8A84B` | `200, 168, 75`  | Gold — Culinary / Chef services  |

> Icon color on category buttons: `#FFFFFF` (inverted for visibility against the colored circle).

### Suggested Category Gradients (for future depth/hover treatments)
| Category | Gradient                                                |
| -------- | ------------------------------------------------------- |
| Home     | `#1F4F6E → #2D6A8F → #3E82AB`                           |
| Beauty   | `#8A3838 → #A34343 → #C95858`                           |
| Health   | `#1F6340 → #2D8A5A → #4CAE7A`                           |
| Chef     | `#8A6A1F → #A6842B → #C8A84B`                           |

---

## 5. Neutral / Surface Palette

| Token           | Hex       | RGB              | Usage                                        |
| --------------- | --------- | ---------------- | -------------------------------------------- |
| `background`    | `#FAFAFA` | `250, 250, 250`  | App background (warm off-white).             |
| `surface`       | `#FFFFFF` | `255, 255, 255`  | Cards, chips, sheets.                        |
| `logo`          | `#F0F7F6` | `240, 247, 246`  | Evergreen-tinted surface for logo treatments.|
| `border`        | `#E5E7EB` | `229, 231, 235`  | Default divider / card border.               |
| `borderLight`   | `#F3F4F6` | `243, 244, 246`  | Subtle chip / input borders.                 |
| `disabled`      | `#D1D5DB` | `209, 213, 219`  | Inactive dots, disabled controls.            |
| `textInverse`   | `#FFFFFF` | `255, 255, 255`  | Text on primary/accent backgrounds.          |

---

## 6. Text Hierarchy

| Token            | Hex       | Usage                                |
| ---------------- | --------- | ------------------------------------ |
| `text`           | `#0E2E32` | Primary body text, titles.           |
| `textSecondary`  | `#6B7280` | Sub-labels, location, metadata.      |
| `textTertiary`   | `#9CA3AF` | Placeholders, least-important text.  |
| `textInverse`    | `#FFFFFF` | Text on dark/colored backgrounds.    |

Text on evergreen backgrounds: use `rgba(255,255,255,0.7)` for subtitles/descriptions.

---

## 7. Feedback / Semantic Colors

| Token          | Hex       | Usage                               |
| -------------- | --------- | ----------------------------------- |
| `success`      | `#2E7D54` | Confirmations, "Verified Pros".     |
| `successLight` | `#E0F0E8` | Success background fills.           |
| `error`        | `#D94F4F` | Errors, destructive actions.        |
| `errorLight`   | `#F5E0E0` | Error background fills.             |

### Supporting icon accents (used on home "Highlights" cards)
| Purpose             | Hex       | Background |
| ------------------- | --------- | ---------- |
| Available Now (clock) | `#3B82F6` | `#EFF6FF`  |
| Verified Pros (shield)| `#10B981` | `#ECFDF5`  |

---

## 8. Overlays & Shadows

| Token      | Value                  | Usage                          |
| ---------- | ---------------------- | ------------------------------ |
| `overlay`  | `rgba(0, 0, 0, 0.5)`   | Modal backdrops.               |
| `shadow`   | `rgba(0, 0, 0, 0.08)`  | Generic soft shadow.           |

### Shadow tiers
```ts
shadow.sm = { color: #000, offset: (0,1), opacity: 0.05, radius: 4,  elevation: 1 }
shadow.md = { color: #000, offset: (0,2), opacity: 0.08, radius: 12, elevation: 3 }
shadow.lg = { color: #000, offset: (0,4), opacity: 0.12, radius: 20, elevation: 5 }
```

---

## 9. Signature Gradient Suite (Quick Reference)

| Name                 | Stops                                 | Where it lives                        |
| -------------------- | ------------------------------------- | ------------------------------------- |
| **Evergreen Hero**   | `#145A4A → #0E3F34 → #0A2D25`         | "Welcome to Brazos" banner, featured. |
| **Brazos Gold**      | `#8A6A1F → #A6842B → #C8A84B`         | "Refer & Earn" banner.                |
| **Coral Trending**   | `#7A2E2E → #A34343 → #C95858`         | "Trending Now" banner.                |
| Home Blue            | `#1F4F6E → #2D6A8F → #3E82AB`         | Category button (optional depth).     |
| Health Emerald       | `#1F6340 → #2D8A5A → #4CAE7A`         | Category button (optional depth).     |

All gradients use 135° (`{x:0,y:0} → {x:1,y:1}`) for visual consistency.

---

## 10. Spacing, Radius, Typography (for full context)

### Spacing scale (px)
`xs: 4 · sm: 8 · md: 16 · lg: 24 · xl: 32 · xxl: 48`

### Corner radius (px)
`sm: 8 · md: 12 · lg: 16 · xl: 24 · full: 9999`

### Typography (Inter)
| Style        | Size | Weight | Line | Family                 |
| ------------ | ---- | ------ | ---- | ---------------------- |
| h1           | 28   | 700    | 34   | Inter_700Bold          |
| h2           | 22   | 700    | 28   | Inter_700Bold          |
| h3           | 18   | 600    | 24   | Inter_600SemiBold      |
| body         | 16   | 400    | 22   | Inter_400Regular       |
| bodyMedium   | 16   | 500    | 22   | Inter_500Medium        |
| caption      | 14   | 400    | 20   | Inter_400Regular       |
| captionMed   | 14   | 500    | 20   | Inter_500Medium        |
| small        | 12   | 400    | 16   | Inter_400Regular       |
| smallMedium  | 12   | 500    | 16   | Inter_500Medium        |
| button       | 16   | 600    | 22   | Inter_600SemiBold      |

---

## 11. Developer Handoff — Copy-paste tokens

### CSS Custom Properties
```css
:root {
  /* Evergreen */
  --brazos-primary:        #145A4A;
  --brazos-primary-light:  #0E3F34;
  --brazos-primary-dark:   #0C362C;
  --brazos-primary-deep:   #0A2D25;

  /* Accent gold */
  --brazos-accent:         #C9A84C;
  --brazos-accent-light:   #D4BA6A;
  --brazos-accent-dark:    #A8893D;

  /* Categories */
  --brazos-cat-home:       #2D6A8F;
  --brazos-cat-beauty:     #C95858;
  --brazos-cat-health:     #2D8A5A;
  --brazos-cat-chef:       #C8A84B;

  /* Neutrals */
  --brazos-bg:             #FAFAFA;
  --brazos-surface:        #FFFFFF;
  --brazos-logo-surface:   #F0F7F6;
  --brazos-border:         #E5E7EB;
  --brazos-border-light:   #F3F4F6;

  /* Text */
  --brazos-text:           #0E2E32;
  --brazos-text-secondary: #6B7280;
  --brazos-text-tertiary:  #9CA3AF;

  /* Semantic */
  --brazos-success:        #2E7D54;
  --brazos-error:          #D94F4F;

  /* Gradients */
  --gradient-evergreen: linear-gradient(135deg, #145A4A 0%, #0E3F34 50%, #0A2D25 100%);
  --gradient-gold:      linear-gradient(135deg, #8A6A1F 0%, #A6842B 50%, #C8A84B 100%);
  --gradient-coral:     linear-gradient(135deg, #7A2E2E 0%, #A34343 50%, #C95858 100%);
}
```

### JSON
```json
{
  "brand": {
    "primary": "#145A4A",
    "primaryLight": "#0E3F34",
    "primaryDark": "#0C362C",
    "primaryDeep": "#0A2D25",
    "accent": "#C9A84C",
    "accentLight": "#D4BA6A",
    "accentDark": "#A8893D"
  },
  "categories": {
    "home":   "#2D6A8F",
    "beauty": "#C95858",
    "health": "#2D8A5A",
    "chef":   "#C8A84B"
  },
  "neutral": {
    "background":    "#FAFAFA",
    "surface":       "#FFFFFF",
    "logoSurface":   "#F0F7F6",
    "border":        "#E5E7EB",
    "borderLight":   "#F3F4F6",
    "disabled":      "#D1D5DB"
  },
  "text": {
    "primary":   "#0E2E32",
    "secondary": "#6B7280",
    "tertiary":  "#9CA3AF",
    "inverse":   "#FFFFFF"
  },
  "semantic": {
    "success":      "#2E7D54",
    "successLight": "#E0F0E8",
    "error":        "#D94F4F",
    "errorLight":   "#F5E0E0",
    "infoIcon":     "#3B82F6",
    "infoBg":       "#EFF6FF",
    "verifyIcon":   "#10B981",
    "verifyBg":     "#ECFDF5"
  },
  "gradients": {
    "evergreen": ["#145A4A", "#0E3F34", "#0A2D25"],
    "gold":      ["#8A6A1F", "#A6842B", "#C8A84B"],
    "coral":     ["#7A2E2E", "#A34343", "#C95858"],
    "angleDeg":  135
  },
  "overlay": "rgba(0,0,0,0.5)",
  "shadow":  "rgba(0,0,0,0.08)"
}
```

### React Native (expo/constants/theme.ts)
Already defined. Import via:
```ts
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
```

---

## 12. Usage Rules (do's & don'ts)

**DO**
- Use `#145A4A` Evergreen as the dominant UI color — buttons, active states, iconography.
- Pair Evergreen with the Gold accent (`#C9A84C`) for CTAs on dark surfaces.
- Apply the three signature gradients at **135°** only.
- Keep category colors reserved for the 4 floating category buttons and their destination headers.
- Use white icons on filled category circles for maximum pop.

**DON'T**
- Don't use purple or cool-blue hues outside of the semantic info color (`#3B82F6`).
- Don't mix gradients (e.g. gold stops inside an evergreen banner).
- Don't lower the evergreen gradient contrast below the `#0A2D25` deep stop.
- Don't use pure black (`#000000`) for text — always use `#0E2E32`.
