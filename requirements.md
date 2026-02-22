# 🌸 Birthday Website – Full Build Specification

## Project Overview

Build a mobile‑responsive birthday website using:

* **Next.js (App Router, latest stable)**
* **Tailwind CSS**
* **GSAP** for animations

Theme: **Rose Pink / Cute / Picnicy / Pinterest‑inspired** aesthetic.

Core idea:

* Display selected birthday gifts (carted items).
* Each gift must allow her to:

  * Replace the product link.
  * Mark it as "Keep this".
  * Suggest an alternative.
* Keep empty items visible so she can add her own suggestions.

This is not just a static page. It must behave like a lightweight interactive wishlist editor.

---

# 🎨 Design System

## Color Palette (Rose Pink Theme)

```ts
// tailwind.config.ts extend colors
rosePrimary: '#F472B6',
roseSoft: '#FBCFE8',
roseLight: '#FFF1F5',
cream: '#FFF7ED',
accentRed: '#BE123C'
```

## Typography

* Headings: Playfair Display (romantic, soft serif)
* Body: Poppins or Inter
* Use soft font weights (400–600)

## Visual Style

* Rounded corners: `rounded-2xl`
* Soft shadows: `shadow-lg shadow-pink-200/40`
* Card background: white with soft pink border
* Subtle gradients: `bg-gradient-to-br from-rose-100 to-pink-50`
* Floating petal decorative elements
* Slight rotation on cards for Pinterest feel

---

# 📁 Folder Structure

```
/app
  layout.tsx
  page.tsx
/components
  GiftCard.tsx
  EditableLinkModal.tsx
  EmptyGiftCard.tsx
  Header.tsx
  Footer.tsx
/data
  gifts.ts
/styles
  globals.css
```

---

# 🧠 Data Model

Create a structured gift model.

```ts
export type GiftStatus = 'selected' | 'empty'

export interface Gift {
  id: number
  title: string
  description: string
  link: string | null
  status: GiftStatus
}
```

---

# 🎁 Initial Gifts Data

## Selected Gifts (Carted)

1. Cute printed ankle socks
2. Slippers to wear at home
3. Fleece stockings
4. Cute teddy bag charms
5. Desk lamp
6. Sipper

## Empty / Open Gifts

1. Gym / workout pants
2. Cherry red shoulder bag
3. Floor lamp
4. White curtains

`/data/gifts.ts` should export initial state.

---

# 🖼 Homepage Layout (page.tsx)

Sections:

1. Hero Section
2. Love Note Section
3. Gift Grid
4. Add More Wishes Section

---

# 🌺 Hero Section

Large romantic intro:

* Soft animated pink background

* Floating petals using GSAP

* Heading:

  > "For the Girl Who Sends Wishlists as Jokes 🌷"

* Subtext:

  > "This year, I took notes."

Animate text fade + upward motion using GSAP timeline.

---

# 💌 Love Note Section

Soft card centered:

* Short romantic message
* Animated typewriter effect (GSAP)
* Slight parallax on scroll

---

# 🛍 Gift Grid Section

Responsive layout:

```tsx
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

Each gift renders as:

* If `status === 'selected'` → `GiftCard`
* If `status === 'empty'` → `EmptyGiftCard`

---

# 🎀 GiftCard Component

Props:

```ts
interface GiftCardProps {
  gift: Gift
  onUpdateLink: (id: number, newLink: string) => void
}
```

UI:

* Cute title
* Placeholder aesthetic product image
* Current product link (clickable)
* Buttons:

  * "Change this"
  * "Keep this"

When clicking "Change this":

* Open `EditableLinkModal`

Animations:

* Hover scale 1.05
* Slight rotate
* Floating effect using GSAP

---

# ✏ EditableLinkModal

Features:

* Input field for new link
* Save button
* Cancel button
* Smooth fade in/out
* Backdrop blur

GSAP animation:

* Scale from 0.8 to 1
* Opacity 0 → 1

---

# 🌼 EmptyGiftCard Component

Purpose:
Allow her to suggest something.

UI:

* Dashed pink border
* Text: "Add your dream version ✨"
* Input for product link
* Save suggestion button

When saved:

* Convert status to "selected"
* Store link

---

# 🧸 Add More Wishes Section

At bottom:

Large soft pink box:

* Textarea:

  > "Anything else you secretly want?"

* Save to local state

---

# 💾 State Management

Use React useState in page.tsx initially.

Optional enhancement:

* Persist to localStorage
* Hydrate on load

---

# 🎬 GSAP Animation Requirements

Install:

```
npm install gsap
```

Use in:

1. Hero entrance
2. Card stagger animation on scroll
3. Modal open/close
4. Floating decorative hearts/petals

Use `useRef` + `useEffect`.

Stagger example:

```ts
gsap.from(cardsRef.current, {
  opacity: 0,
  y: 40,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out'
})
```

---

# 📱 Mobile Responsiveness

* Single column layout on mobile
* Larger tap targets
* Sticky "Birthday Surprise" header
* Buttons full width on mobile

---

# 🌸 Extra Cute UI Details

* Tiny floating hearts in corner
* Soft bounce animation on CTA buttons
* Subtle background noise texture
* Confetti animation when she saves a change

---

# 🚀 Deployment

Deploy on:

* Vercel

Environment:

* No backend required
* Pure client side state

---

# 🧩 Optional Enhancements

1. Password protect page
2. Add countdown timer to birthday
3. Add background music toggle
4. Screenshot export feature

---

# 🧠 Final Notes for Copilot

* Use clean reusable components
* Keep animation code separate from JSX logic
* Maintain soft romantic visual consistency
* Ensure all buttons are accessible
* Avoid heavy libraries except GSAP

This file defines full structure, behavior, design system, and interaction logic required to generate the birthday website.
