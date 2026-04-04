# Design System Strategy: Geometric Minimalism & The Architectural Monograph

## 1. Overview & Creative North Star: "The Ordered Archive"
The Creative North Star for this design system is **The Ordered Archive**. Moving away from the fluid, organic trends of modern web design, this system draws inspiration from high-end architectural monographs and curated museum catalogs. It is a celebration of the "right angle" and the "hairline."

The experience is defined by **intentional rigidity**. By utilizing a disciplined grid and structural hairlines, we create a sense of permanent, authoritative calm. We break the "template" look not through rounded corners or soft shadows, but through aggressive whitespace, asymmetrical layout balancing, and the rhythmic repetition of geometric motifs. Every element must feel as though it was measured and placed with a physical ruler.

## 2. Colors: Tonal Depth & The Line
The palette is a sophisticated dialogue between the warmth of the earth and the precision of ink.

*   **Primary (#173124):** Used for structural elements and high-impact typography. It acts as the "ink" of the monograph.
*   **Secondary (#944925):** A rusted accent used sparingly to draw the eye to critical actions or highlight archival details.
*   **Surface (#fbf9f4):** The "Paper." All layouts start here.

### The "Precision Line" Rule
While many systems rely on background shifts, this system embraces the **Hairline**. Section boundaries are defined by ultra-fine horizontal or vertical lines using the `outline-variant` token. These lines should be exactly 1px. They do not merely separate; they frame.

### Surface Hierarchy & Geometric Nesting
Depth is achieved through the architectural stacking of rectangles:
*   **Surface-Container-Lowest (#ffffff):** Used for "Hero" content cards to make them pop against the off-white base.
*   **Surface-Container-High (#eae8e3):** Used for sidebars or "technical data" blocks to create a subtle recessed effect.
*   **The Geometric Accent:** Use small, 4px x 4px squares (using `primary` or `secondary`) at the intersection of hairlines to mimic architectural drafting marks.

### Signature Textures
To avoid a clinical feel, use a subtle grain overlay on `surface` backgrounds. For primary CTAs, use a linear gradient from `primary` (#173124) to `primary_container` (#2d4739) at a 45-degree angle to provide a "leather-bound" depth.

## 3. Typography: The Editorial Dialogue
The pairing of **Manrope** (San-Serif) and **Newsreader** (Serif) creates a tension between modern precision and historical record.

*   **Display & Headlines (Manrope):** These are the "Structural Headers." Use `display-lg` and `headline-md` for navigational wayfinding. Manrope’s geometric nature reinforces the grid.
*   **Titles & Body (Newsreader):** These are the "Narrative Layers." Use `title-lg` and `body-lg` for all storytelling content. The serif nature of Newsreader adds the necessary warmth to the geometric layout.
*   **Labels (Manrope):** Use `label-md` in all-caps with 0.1rem letter-spacing for technical metadata (e.g., "DATE ACQUIRED," "DIMENSIONS").

## 4. Elevation & Depth: Tonal Layering
In an architectural monograph, depth is literal, not digital. We reject heavy drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Instead of shadows, use `surface-container` shifts. A `surface-container-highest` block placed on a `surface` background provides all the hierarchy required.
*   **The "Ghost Border" Fallback:** If a container requires further definition, use a 1px border of `outline` at 15% opacity. This creates a "watermark" effect rather than a hard stroke.
*   **Zero Roundedness:** The `roundedness` scale is strictly **0px** across all components. Sharp corners communicate precision and intent.
*   **The Glass Rule:** For floating navigation or "quick view" overlays, use `surface` with a 90% opacity and a `20px` backdrop-blur. This simulates vellum paper resting over a drafting table.

## 5. Components: Structural Primitives

### Buttons
*   **Primary:** Solid `primary` fill, white `on-primary` Manrope text. Sharp 0px corners.
*   **Secondary:** 1px `primary` border (Hairline) with `primary` text. No fill.
*   **Tertiary:** `label-md` typography with a 1px `secondary` (Rust) underline that extends 4px beyond the text on both sides.

### Framing & Imagery
*   **The Monograph Frame:** Images should never be full-bleed. They should be "inset" within a `surface-container-low` rectangle, surrounded by a 1px `outline-variant` border to mimic matted gallery art.

### Input Fields
*   **Style:** Minimalist underline only. A 1px `outline` line that turns into a 2px `primary` line on focus.
*   **Labels:** Always floating `label-sm` in `primary`, positioned exactly 8px above the input line.

### Lists & Dividers
*   **Rule:** Forbid standard dividers. Instead, use a "Grid Motif." Separate list items with 24px of vertical whitespace and a single, 8px wide vertical line (Hairline) in `secondary` next to the item title to indicate selection.

### Additional Component: The "Data Grid"
*   A specialized container for metadata. Use a 2-column grid separated by a vertical hairline. Left side: `label-sm` (Manrope/Bold). Right side: `body-sm` (Newsreader).

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align a headline to the far left and the body text to a narrow column on the right.
*   **Use Hairlines:** Use 1px lines to "anchor" floating text to the edges of the screen.
*   **Respect the "Air":** Leave at least 80px of margin between major vertical sections.

### Don't:
*   **No Border Radii:** Never use rounded corners. A single 4px radius breaks the architectural integrity of the system.
*   **No Soft Shadows:** Avoid standard Material Design elevation shadows. If a shadow is vital, use a "Hard Shadow": 4px offset, 0px blur, in `surface-variant`.
*   **No Centered Text:** Editorial layouts should be left-aligned or justified to maintain the "block" feel of a monograph. Avoid centering large blocks of text.