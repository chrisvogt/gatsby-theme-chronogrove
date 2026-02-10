# Career visualization alternatives

Ways to present the same career-path data that are clearer and more maintainable than the current D3 tree.

---

## 1. **Timeline bar chart (Gantt-style)** ✅ Implemented

- **What:** One horizontal bar per role. X-axis = years (2003→now), bar length = duration. Bars stacked or grouped by path (Design / IT / Engineering), color-coded.
- **Pros:** Instantly readable (“when” and “how long”), no overlapping nodes, works on mobile (scroll or compact rows), easy to implement in CSS/SVG or a small amount of D3. Click bar → same detail panel.
- **Cons:** Doesn’t show “branching” or cross-path links (e.g. Apogee in two paths); that story is in the copy instead.

---

## 2. **Swimlane timeline**

- **What:** Three horizontal lanes (Design, IT, Engineering), time left-to-right. Each role is a block/card in the correct lane at the right time. Overlaps (e.g. Art In Reality alongside other work) are visible.
- **Pros:** Makes “I did design and IT in parallel” obvious. Familiar “project timeline” look.
- **Cons:** Needs more horizontal space; on small screens you’d scroll or collapse lanes.

---

## 3. **Single-column vertical timeline**

- **What:** One chronological list of roles, sorted by start date. Each row: year span, path badge (color), company + title. Expand or click for description.
- **Pros:** Very simple, accessible, no graph library. Works everywhere. Path can be a small pill/tag.
- **Cons:** Less “visual”; feels more like a styled list than a viz.

---

## 4. **Bento / card grid**

- **What:** Cards for each role (or each company), optionally grouped by path or by decade. Small timeline strip or “years” hint on each card.
- **Pros:** Modern, scannable, easy to make responsive. Good if you want to lean into “portfolio” rather than “timeline”.
- **Cons:** Chronological order is less obvious unless you sort or add labels.

---

## 5. **Stepped line or “journey” line**

- **What:** One line that moves left-to-right over time, with a labeled node at each role change. Path can be color-coded segments or labels at each step.
- **Pros:** Minimal, elegant, “one path” narrative even if data has multiple paths.
- **Cons:** Harder to show overlapping roles (e.g. freelance + full-time); might need to pick “primary” path per year.

---

## Recommendation

- **Timeline bar chart** is the best first replacement: same data, same “click for details” behavior, much simpler code and clearer read. Implemented as `CareerTimeline.js` so you can A/B it with the current tree.
- If you want to emphasize **parallel paths**, try the **swimlane** next.
- If you want **minimalism and accessibility**, the **vertical timeline** is a strong option with no chart dependency.
