# Nikhil Madipadige — interactive technology practice

## Direction

Build a personal technology practice rather than a portfolio template. The site should feel like an intelligent product studio led by one builder: clear point of view, plain-language capability framing, strong selected work, and an immersive visual layer that makes the work memorable.

## Design movement

Reference the structural clarity and interactive canvas quality of Apekōn, but keep Nikhil’s own dark, direct, experimental voice. The interface is editorial and spacious; the WebGL field is the expressive layer.

## Core principles

1. Clarity before spectacle: clients understand what Nikhil can help them build within the first screen.
2. One world, many states: a single shared 3D field changes material, color, and movement according to the active section or project.
3. Evidence over decoration: selected work uses direct project claims, real links, and compact proof.
4. Motion has meaning: scroll and pointer movement reveal hierarchy, system relationships, and project character.

## Color philosophy

Graphite and warm white establish trust. One signal color is reserved for the active state and changes by project: electric lime for AI systems, cobalt for voice, red for security, amber for creative web, violet for real-time 3D. The 3D field uses restrained emissive color rather than neon everywhere.

## Layout paradigm

A calm two-column editorial shell with an always-present canvas layer. Large sections pin or overlap while the content stays readable. Work is shown as long-form chapters, not a card grid.

## Signature elements

- A fixed WebGL signal field made from low-count particles, wire rings, and a central orb.
- A small command-line style location marker: `nick@dev ~`.
- Work chapters that change the shared field state while their evidence enters in staggered motion.

## Interaction and animation

Use Lenis for smooth scrolling, Motion for React state transitions and enter/exit choreography, and Three.js for one shared scene. Use IntersectionObserver and scroll progress to update the scene without mounting one canvas per section. Cap device pixel ratio, pause rendering when the canvas is not visible, honor prefers-reduced-motion, and keep touch layouts free from cursor-only interactions.

## Content structure

Home: direct positioning statement, capabilities, selected work chapters, working approach, and contact CTA. Supporting routes retain About/Profile, Work, Contact, and project case-study routes.

## Brand essence

A curious technical builder who turns ambiguous ideas into working AI, security, automation, and interactive prototypes.

## Voice

Direct, specific, and human. Example lines: “Bring me the messy first version.” “I can help you turn an idea into something your team can test.”

## Project structure

- `src/main.jsx`: routes, content sections, motion choreography, and shared application shell.
- `src/SignalField.jsx`: optimized Three.js canvas and section/project state mapping.
- `src/styles.css`: responsive editorial system, scene overlays, and motion-safe fallbacks.
- `public/assets`: supplied portrait, resume, and truthful project assets.
