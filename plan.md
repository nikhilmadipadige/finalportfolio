# Nikhil Madipadige — continuous scene portfolio

## Direction

Rebuild the portfolio as one continuous interactive instrument rather than a portfolio page with a decorative 3D background. The user should experience a central technical object, move through its states, and discover Nikhil’s projects as evidence of what the object can become.

## Reference-derived design movement

The visual language follows the reference video’s high-tech brutalism: black space, quiet monochrome typography, four-corner HUD framing, a branded loader, an always-present central object, and morph-based transitions between organic material, mesh, particles, and network states. The reference guides the interaction grammar, not the surface branding.

## Core principles

1. The scene carries the narrative; text explains the current state without competing with it.
2. One object, many states: origin, practice, security, voice, vision, scrollytelling, real-time 3D, and contact share one continuous WebGL environment.
3. Evidence is sparse and truthful: project imagery, tags, links, and short descriptions appear as annotations around the active state.
4. Authority comes from pacing and control: damped scrolling, precise labels, restrained color, and material transitions replace generic portfolio choreography.

## Visual system

The palette is near-black, warm technical white, graphite, and cool slate. Project states introduce only restrained secondary tints inside the object and network layer: security red, voice blue, vision green, scrolly amber, and Unreal violet. Typography pairs a quiet geometric sans with DM Mono metadata. The layout uses empty space, four-corner anchors, a vertical progress rule, technical counters, and a sliding system index.

## Interaction and animation

Lenis creates damped movement through the track. Motion handles loader exit, stage copy choreography, evidence reveals, and the index panel. Three.js owns the persistent scene: a glossy displaced core, wireframe shell, particle shell, orbital rings, stars, network nodes, and a scan line. Scroll changes the scene target state continuously; pointer movement influences the camera and core deformation. Rendering is lazy-loaded, pixel-ratio capped, visibility-paused, reduced-motion aware, and simplified on smaller screens.

## Content structure

The home and work routes share an eight-state scene track: origin, point of view, ShieldSense, SamurAI, Expression Lab, Supernatural / Scrolly, Star Wars / Unreal, and open channel. Supporting About, Contact, and project case-study routes retain the real profile, resume, links, summaries, imagery, and project destinations.

## Project structure

- `src/main.jsx`: route shell, loader, HUD frame, scene track, stage content, index panel, project evidence, and supporting pages.
- `src/SignalField.jsx`: lazy Three.js scene director and stage-to-material/network mapping.
- `src/styles.css`: monochrome spatial system, HUD layout, scene annotations, index panel, responsive rules, and motion-safe fallbacks.
- `public/assets`: supplied portrait, resume, and truthful project assets.
