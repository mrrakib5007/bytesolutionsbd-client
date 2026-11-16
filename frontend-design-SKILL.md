# Frontend Design & UI/UX Engineering Skill

## Purpose

Design and implement polished, accessible, responsive, production-ready interfaces for websites and web applications. This skill applies to any product or industry: SaaS, dashboards, marketplaces, portfolios, e-commerce, editorial sites, landing pages, internal tools, and more.

The goal is not merely to make a page look attractive. The interface must help the intended user complete their task clearly, efficiently, and confidently.

---

## 1. Start With Product and User Context

Before designing or coding, identify:

- **Product type:** What kind of website or application is this?
- **Audience:** Who will use it? Consider their technical familiarity, needs, and constraints.
- **Primary task:** What is the most important action users should complete?
- **Secondary tasks:** What else must be easy to find?
- **Device context:** Is mobile, desktop, or both equally important?
- **Brand direction:** Is there an existing brand, design system, logo, or color palette?
- **Content and data:** What real information must the interface present?
- **Constraints:** Framework, component library, browser support, accessibility, performance, and deadlines.

If information is missing, make reasonable assumptions and state them briefly. Do not invent complex product requirements.

## 2. UX-First Design Principles

Prioritize:

1. Clarity over decoration.
2. Familiar interaction patterns over unnecessary novelty.
3. Clear visual hierarchy over uniform emphasis.
4. Readability over dense layouts.
5. Consistency over one-off styling.
6. Useful feedback over silent interactions.
7. Accessibility from the beginning, not as a final patch.
8. Real content and realistic states over placeholder-only design.

For every important screen, answer:

- What should users notice first?
- What is the primary action?
- What information do they need before acting?
- What happens after the action?
- How can they recover from an error?
- What does the screen look like when there is no data or when data is loading?

Avoid adding UI elements that do not support a user task or the product's identity.

## 3. Color Strategy and Color Psychology

Choose colors based on product positioning, audience expectations, emotional tone, and usability—not personal preference alone. Color psychology is contextual rather than universal; validate choices against the brand and audience.

### Common color directions

| Color family | Common associations and useful contexts | Use carefully |
|---|---|---|
| Blue | Trust, reliability, clarity, technology, finance, enterprise, productivity | Can feel generic if used without a distinctive visual system |
| Green | Growth, success, nature, finance, health, sustainability, confirmation | Avoid using green for every element; reserve semantic green for success where appropriate |
| Purple | Creativity, imagination, premium positioning, culture, AI-oriented products | Too much saturated purple can reduce readability and feel visually heavy |
| Teal / Cyan | Calm, modern technology, health, clarity, freshness | Check contrast, especially with pale text or thin strokes |
| Orange | Energy, friendliness, action, discovery, approachable commerce | Large saturated areas can become tiring; use strategically for emphasis |
| Red | Urgency, errors, destructive actions, alerts, passion | Do not use red as a generic accent or the only way to communicate status |
| Yellow / Amber | Optimism, attention, caution, highlights | Small text on yellow often has poor contrast; avoid using it as a text color on white |
| Neutrals | Structure, calm, content focus, professional interfaces | Too many nearly identical gray shades make hierarchy unclear |

### Select a palette systematically

1. Choose a primary brand color that reflects the product's positioning.
2. Choose neutral surfaces and text colors that support readability.
3. Choose one restrained secondary/accent color if the design needs it.
4. Define semantic colors for success, warning, error, and information.
5. Test every foreground/background combination for contrast.
6. Check the palette in both light and dark themes if both are required.
7. Check the interface in grayscale to ensure hierarchy does not depend on color alone.

### Define semantic design tokens

Use tokens instead of scattering arbitrary hex values throughout components.

Example:

```css
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-foreground: #ffffff;

  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-raised: #ffffff;
  --color-border: #e2e8f0;

  --color-text: #0f172a;
  --color-text-muted: #475569;

  --color-success: #15803d;
  --color-warning: #b45309;
  --color-danger: #b91c1c;
  --color-info: #0369a1;
}
```

Treat these values as an example, not a universal palette. Adapt them to the brand and verify contrast.

### Apply color by role

- **Primary CTA:** Use the primary color with strong text contrast. Keep one visually dominant action per major section where possible.
- **Secondary action:** Use an outline, subtle surface, or text button.
- **Navigation:** Use neutral styling by default; use a clear active state that does not rely on color alone.
- **Hover and pressed states:** Make the interaction visible without causing layout shifts.
- **Focus state:** Use a clearly visible focus ring.
- **Success:** Use semantic success colors with a label or icon and explanatory text where useful.
- **Warning:** Use amber/yellow with sufficient contrast and clear wording.
- **Error:** Use red for errors and destructive actions, but include text explaining the issue.
- **Disabled:** Reduce emphasis while retaining readable labels; do not make disabled content completely illegible.
- **Selected state:** Combine color with another cue such as a border, checkmark, weight, or shape.

### Contrast and accessibility

Target WCAG 2.2 AA:

- Normal text: at least **4.5:1** contrast.
- Large text: at least **3:1** contrast.
- Essential graphical objects and UI component boundaries: at least **3:1** where applicable.
- Never communicate meaning through color alone.
- Do not assume that a visually attractive pastel palette is automatically accessible.
- Test actual text, icon, border, and surface combinations—not just the brand color in isolation.

## 4. Typography

- Use a clear type scale with distinct roles for display headings, page headings, section headings, body text, labels, and captions.
- Use one primary type family and, only when justified, one complementary family.
- Choose fonts that support the languages and scripts used by the audience.
- Prioritize legibility, line height, and appropriate line length.
- Avoid using tiny text to fit too much content.
- Use weight and size to establish hierarchy; do not make every heading bold and oversized.
- Use tabular numerals for aligned financial or statistical values when appropriate.
- Keep long-form text at a comfortable reading width.

## 5. Layout, Spacing, and Visual Hierarchy

- Establish a consistent spacing scale and apply it throughout the product.
- Use alignment and grouping to show relationships between elements.
- Give important content enough whitespace.
- Avoid excessive cards, borders, shadows, gradients, and nested containers.
- Use grid and flex layouts intentionally; do not position major content with arbitrary offsets.
- Keep page widths appropriate for the content type.
- Make responsive behavior intentional rather than simply shrinking desktop layouts.
- Use a consistent radius and elevation system.
- Reserve large display typography for moments where it supports the page's purpose.

## 6. Components and Interaction Design

Build reusable components with consistent states and behavior.

For interactive components, consider:

- Default
- Hover
- Focus-visible
- Active / pressed
- Selected
- Disabled
- Loading
- Success
- Error

Specific guidance:

- Buttons must look and behave like buttons.
- Links must navigate and be visually distinguishable from plain text.
- Forms need persistent labels, useful validation, and actionable error messages.
- Search should show a clear empty state and useful feedback.
- Dialogs must support keyboard interaction, focus management, and a clear close action.
- Dropdowns and menus must be keyboard accessible.
- Tabs should communicate the active tab and have predictable navigation.
- Destructive actions should be visually distinct and may require confirmation.
- Avoid clickable-looking elements that do nothing.

## 7. Responsive Design

Design for small screens first when mobile usage is important, then enhance for larger viewports.

Check at minimum:

- Narrow mobile
- Typical mobile
- Tablet
- Laptop
- Large desktop

Responsive requirements:

- Prevent horizontal overflow.
- Keep tap targets comfortably large; aim for approximately 44 × 44 CSS pixels where practical.
- Do not hide essential actions without providing a discoverable alternative.
- Reflow tables, navigation, sidebars, and complex layouts thoughtfully.
- Keep text readable without unnecessary zooming.
- Ensure dialogs and menus fit within the viewport.
- Test real content lengths, not only short placeholder text.

## 8. Motion and Feedback

Use motion to communicate state changes, hierarchy, and cause-and-effect—not as decoration everywhere.

- Prefer short, subtle transitions.
- Avoid animation that delays essential tasks.
- Respect `prefers-reduced-motion`.
- Use skeletons only when they improve perceived loading; otherwise use a simple progress indicator.
- Provide immediate feedback after user actions.
- Prevent layout shifts during loading whenever possible.
- Avoid excessive parallax, bouncing, pulsing, and continuous movement.

## 9. Content and Interface Copy

- Use concise, specific labels.
- Prefer action-oriented button text such as “Create account” over vague text such as “Continue” when the action is known.
- Explain errors in plain language and tell users how to fix them.
- Make empty states helpful: explain why the state is empty and what the user can do next.
- Use realistic sample data during development.
- Keep terminology consistent across navigation, buttons, forms, and messages.
- Avoid filler text and generic marketing claims.

## 10. Avoid Generic AI-Generated Design

Do not default to the same predictable landing page or dashboard layout for every product.

Avoid:

- Repeated gradient backgrounds without a product reason.
- Excessive glassmorphism and blur.
- Too many rounded cards inside rounded cards.
- Random decorative blobs and floating shapes.
- Huge headings that push useful content below the fold.
- Repeated three-card feature sections when another layout would communicate better.
- Overuse of badges, pills, and colored labels.
- Low-contrast muted text.
- Inconsistent icon styles.
- Fake charts, fake testimonials, and meaningless statistics.
- Decorative UI that competes with the main task.

Create a visual direction that fits the product, audience, content, and brand. Use visual variety only when it improves communication.

## 11. Iconography and Visual Assets

### Never use emoji or Unicode pictographs as interface icons

Do not use emoji or operating-system emoji glyphs as substitutes for professional UI icons. Examples include:

- 🎇 📢 🚀 🔔 ⭐ 💼 ❤️ 🔍 ⚙️

This rule applies to navigation, buttons, feature lists, dashboard metrics, status indicators, empty states, notifications, social controls, footers, and decorative interface elements.

Emoji may be appropriate in user-generated content or conversational copy when the product's tone explicitly calls for them, but they must not replace the interface icon system.

### Prefer a proper icon library

Use an icon library already installed in the project whenever possible. Common options include:

- **Lucide:** `lucide-react`
- **Heroicons:** `@heroicons/react`
- **Phosphor:** `@phosphor-icons/react`
- **React Icons:** `react-icons`
- **Material Symbols / Material Icons**

For a React or Next.js project, use the library's React components rather than manually inserting emoji or arbitrary Unicode characters.

Before adding a dependency:

1. Inspect the project's existing dependencies and current icon usage.
2. Reuse the installed icon library if it is suitable.
3. Do not install a second icon package just to obtain a minor variation.
4. Keep one consistent icon family and visual style across the interface.

### If the required icon is unavailable

Search reputable icon catalogs or official icon websites, prioritizing:

- The official library catalog and documentation.
- Well-maintained open-source icon repositories.
- Assets with clear licensing and attribution requirements.

Prefer importing an official package icon or using a clean, optimized SVG from a trustworthy source. Check the license before using third-party assets. For production, prefer local assets or package dependencies over fragile hotlinked image URLs.

Do not use random stock images, screenshots, emoji images, or unrelated illustrations as icon substitutes.

### Icon consistency and accessibility

- Choose icons by meaning, not merely by appearance.
- Keep stroke width, visual weight, corner style, and sizing consistent.
- Use a consistent sizing scale (for example, 16, 18, 20, and 24 px).
- Pair unfamiliar icons with visible text labels.
- Icon-only buttons must have an accessible name, such as `aria-label`.
- Decorative icons should be hidden from assistive technology, for example with `aria-hidden="true"`.
- Do not communicate status with an icon or color alone; include a text label where needed.
- Avoid icons that could be interpreted in multiple ways.
- Do not stretch or distort SVG icons.

### Icons versus illustrations

Icons communicate compact actions, objects, or states. Illustrations communicate concepts or add visual storytelling. Do not use a large illustration where a small action icon is needed, and do not fill a feature section with unrelated icons merely for decoration.

## 12. Images and Other Visual Assets

- Use images that support the content, product, or brand.
- Prefer authentic product screenshots, relevant photography, or purpose-made illustrations.
- Maintain consistent image treatment, aspect ratios, and cropping.
- Use appropriate `alt` text for informative images; use empty alt text for purely decorative images.
- Avoid generic stock imagery that adds no meaning.
- Optimize image formats, dimensions, and loading behavior.
- Do not use an image as a substitute for accessible text or a functional UI component.

## 13. Accessibility Requirements

- Use semantic HTML elements.
- Support keyboard navigation.
- Ensure visible focus indicators.
- Associate form controls with labels.
- Provide accessible names for icon-only controls.
- Use correct heading order and landmarks.
- Make error messages understandable and programmatically associated with fields when appropriate.
- Ensure dialogs, menus, and popovers manage focus correctly.
- Respect reduced-motion preferences.
- Test contrast and do not rely on color alone.
- Consider screen-reader behavior for dynamic updates.

## 14. Framework and Code Quality

Follow the conventions and architecture of the project's actual stack.

For React and Next.js:

- Reuse existing components, tokens, and dependencies before adding new ones.
- Keep components focused and composable.
- Use Server Components by default in the Next.js App Router; add `"use client"` only when client-side interactivity or browser APIs are required.
- Avoid unnecessary client-side state and effects.
- Use semantic HTML and accessible component patterns.
- Keep data fetching, validation, and UI responsibilities appropriately separated.
- Use the project's existing styling approach and avoid introducing competing systems.
- Handle loading, error, empty, and success states.
- Avoid hard-coded values when a shared token or configuration is appropriate.
- Keep code readable, maintainable, and type-safe.

Do not rewrite unrelated parts of an existing project just to impose a preferred architecture.

## 15. Performance and Production Readiness

- Avoid unnecessary dependencies.
- Optimize images and fonts.
- Prevent layout shifts.
- Avoid expensive animations and unnecessary re-renders.
- Load below-the-fold assets appropriately.
- Keep client-side JavaScript proportionate to the interaction needs.
- Check console errors, hydration warnings, broken links, and failed requests.
- Verify forms and primary interactions end-to-end.
- Ensure the interface remains useful on slow connections and small screens.

## 16. Design and Implementation Workflow

Use this workflow for each task:

### Pass 1 — Understand and plan
1. Inspect the existing codebase and design system, if available.
2. Identify the page's primary user task and content hierarchy.
3. Choose a visual direction appropriate to the product.
4. Define or reuse color, typography, spacing, radius, and elevation tokens.
5. Identify required components, states, and responsive behavior.

### Pass 2 — Build
1. Implement the main structure and hierarchy.
2. Add reusable components and semantic styling.
3. Implement real interactions and all relevant states.
4. Add consistent icons from the project's icon library.
5. Add responsive behavior and accessibility support.
6. Use realistic content and data.

### Pass 3 — Critique and refine
Review the result as a designer, developer, and user:

- Is the main task immediately obvious?
- Is the visual hierarchy clear?
- Are colors purposeful and accessible?
- Are icons consistent and from a proper icon library?
- Is any decoration unnecessary?
- Does the layout work on mobile and desktop?
- Are all controls functional?
- Are loading, empty, error, and success states handled?
- Is the interface keyboard and screen-reader friendly?
- Are there console errors, layout shifts, or performance issues?

Fix the most important problems before considering the work complete.

## 17. Final Quality Checklist

Before delivery, confirm:

- [ ] The design fits the product and its audience.
- [ ] The primary action is obvious.
- [ ] Typography and spacing are consistent.
- [ ] Colors have clear semantic roles.
- [ ] Text and important UI elements meet contrast requirements.
- [ ] No emoji or OS emoji glyphs are used as UI icons.
- [ ] Icons come from a consistent, reputable icon library or verified asset source.
- [ ] All interactive elements work.
- [ ] Loading, empty, error, disabled, and success states are considered.
- [ ] Mobile, tablet, and desktop layouts are checked.
- [ ] Keyboard navigation and focus states work.
- [ ] Images and icons have appropriate accessibility treatment.
- [ ] No unnecessary dependencies or decorative clutter were introduced.
- [ ] The implementation is maintainable and production-conscious.

## Operating Rule

Make deliberate design decisions and explain important trade-offs briefly when useful. Do not blindly follow a visual trend, invent requirements, or prioritize visual effects over usability. Deliver an interface that is distinctive, coherent, accessible, responsive, and genuinely useful.
