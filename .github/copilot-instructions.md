# Portfolio Project - AI Coding Agent Instructions

## Project Overview
This is a personal portfolio website built with React 19, Vite 7, and Tailwind CSS 4. The site showcases a full-stack developer's projects, skills, education, and achievements with sophisticated animations and interactive UI elements.

## Tech Stack
- **Frontend**: React 19.1.1 (with JSX)
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16 with Vite plugin
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.548.0
- **Linting**: ESLint 9.36.0 with flat config

## Key Architectural Patterns

### Component Structure
- **Main app entry**: `src/main.jsx` renders `<App />` with StrictMode
- **Single-page layout**: `src/App.jsx` imports and renders the main `PortPolio` component
- **Feature components**: Located in `src/components/portpolio/` (note the typo in "portpolio")
  - `Portpolio.jsx` - Main portfolio component with all sections
  - `change.jsx` - Alternative/experimental version (not currently used)

### Custom Hooks Pattern
The codebase uses a custom `useTiltMotion` hook for 3D card tilt effects:
```jsx
const useTiltMotion = (ref) => {
  // Returns: onMouseMove, onMouseLeave, and style object with framer-motion values
  // Used on: ProjectCard, EducationCard, and other interactive elements
}
```
Always apply this pattern to cards/interactive elements by:
1. Creating a ref with `useRef(null)`
2. Calling `const tiltProps = useTiltMotion(ref)`
3. Spreading `ref`, `onMouseMove`, `onMouseLeave`, and `style` props

### Framer Motion Usage
- Use `motion.div` for all animated components
- Common props: `initial`, `whileInView`, `viewport={{ once: true }}`, `transition`
- Scroll-based animations use `useScroll()`, `useTransform()`, and `useSpring()`
- Global cursor glow effect uses `useMotionValue()` tracking mouse position

### Navigation & Scrolling
- Fixed header with smooth scroll navigation
- Scroll function: `scrollToSection(href)` - finds element by ID and uses `scrollIntoView({ behavior: 'smooth' })`
- Note: `scroll-padding-top: 5rem` applied in global styles to account for fixed header

## Development Workflow

### Running the Project
```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### ESLint Configuration
- Uses new flat config format (`eslint.config.js`)
- Custom rule: `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` - allows unused vars if uppercase (constants/components)
- Ignores `dist/` folder globally

### Styling Conventions
- Tailwind 4.x imported via `@import "tailwindcss"` in CSS files (App.css and index.css)
- Heavy use of utility classes: responsive (`sm:`, `md:`, `lg:`), backdrop blur, gradients
- Common gradient pattern: `bg-gradient-to-r from-purple-400 to-pink-500` or `from-blue-500 via-purple-500 to-pink-500`
- Custom animations defined in inline `<style>` tag: `@keyframes float`, `@keyframes color-shift`

## Component Patterns

### Section Structure
Each major section follows this pattern:
```jsx
<section id="section-name" className="py-20 relative">
  <SectionTitle>Section Name</SectionTitle>
  {/* Section content with motion.div animations */}
</section>
```

### Responsive Design
- Mobile-first approach with breakpoints: `sm:`, `md:`, `lg:`
- Mobile menu toggles with framer-motion animations
- Grid layouts switch from 1 column to 2-3 columns: `grid md:grid-cols-2 lg:grid-cols-3`

### Interactive Cards
- ProjectCard: Has flip animation on click, tilt on hover, displays front/back content
- EducationCard: Timeline layout, alternates left/right on desktop, tilt effect
- SkillOrb: Floating animation with hover scale effect

## Common Pitfalls & Fixes

### Typo Alert
The folder is named `portpolio` (incorrect) instead of `portfolio`. Maintain this naming for consistency unless explicitly refactoring.

### Framer Motion Transform Issues
When using `useTransform`, ensure proper array format:
```jsx
// CORRECT for multi-value transforms
const shadow = useTransform([x, y], [[0, 1], [0, 1]], [/* output values */]);
```

### CSS Class Patterns
- Use `bg-gray-800/70` for semi-transparent backgrounds (Tailwind opacity syntax)
- Backdrop blur: `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-xl`
- Border colors: `border-white/10`, `border-gray-700`, `border-purple-500/50`

## Project-Specific Data

### Projects Data Structure
Located in `Portpolio.jsx` around line 150:
```jsx
const projects = {
  all: [
    { title, description, tech: [], category: "webdev"|"ml", image }
  ]
};
```
Categories: `webdev` (Web Development), `ml` (Machine Learning)

### Skills Arrays
- `skills`: Core expertise with levels (Machine Learning, Web Development, etc.)
- `technicalSkills`: Tech stack tags displayed as floating orbs (React, Node.js, Python, etc.)

### Education Timeline
Array of objects with `degree`, `institution`, `years`, `description`, `gpa`

## External Links & Integrations
- LeetCode profile: `https://leetcode.com/u/Akas__h/`
- Codeforces: Referenced but no specific profile URL
- LinkedIn: `linkedin.com/in/abir-akash-564360334`
- GitHub: `github.com/A-k-a-sh`
- Email: `u2104035@student.cuet.ac.bd`

## When Making Changes

### Adding New Sections
1. Create section with proper ID: `<section id="unique-id">`
2. Add to `navItems` array in component
3. Use `SectionTitle` component for consistent heading style
4. Wrap content in `motion.div` with appropriate animations

### Adding Projects
Update the `projects.all` array with required fields. Ensure image URLs are valid (currently using placehold.co).

### Modifying Animations
- Adjust spring config in `useTiltMotion`: `damping`, `stiffness`, `mass`
- Modify scroll animations via `useTransform` ranges
- Update keyframe animations in inline `<style>` tag

### Build Optimization
- Images should be in `public/` folder (currently only has vite.svg)
- Consider lazy loading for off-screen content
- Check bundle size after adding heavy dependencies
