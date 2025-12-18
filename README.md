# The Cosmic Museum 🌌

An interactive browser-based space museum where you can explore the universe through six immersive wings. I built this as a way to combine my interest in space exploration with web development, and honestly, it turned out way cooler than I initially imagined.

[**Live Demo**](www.thecosmicmuseum.com)

![Cosmic Museum Preview](preview-screenshot.png)

## What's This About?

Think of it as a digital planetarium meets interactive museum. You get an animated starfield background (yes, it actually moves), smooth page transitions, and content covering everything from the history of astronomy to the latest exoplanet discoveries. No fancy frameworks - just vanilla HTML, CSS, and JavaScript keeping things fast and clean.

## Features

**The Experience:**
- Real-time animated starfield with shooting stars
- Smooth scrolling and hover effects throughout
- Works great on mobile and desktop
- Each "wing" focuses on a different aspect of space

**Six Exhibition Wings:**
1. **History** - Timeline from ancient Babylonian astronomy to JWST
2. **Exoplanets** - Notable worlds beyond our solar system
3. **Missions** - Iconic expeditions from Voyager to Mars rovers
4. **Deep Space** - Nebulae, black holes, and cosmic phenomena
5. **News** - Recent discoveries and space updates
6. _(Astrobiology wing coming eventually)_

## Running It Locally

Clone it and open `index.html` in your browser. That's it.

```bash
git clone https://github.com/yourusername/cosmic-museum.git
cd cosmic-museum
# Just open index.html in your browser
```

If you want a local server (optional):
```bash
python -m http.server 8000
```

## Tech Stack

Keeping it simple:
- HTML5 (canvas for the starfield animation)
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (no dependencies)
- Google Fonts (Orbitron + Inter)

The whole thing is about 150KB total. No build process, no npm packages, no webpack config to fight with.

## File Structure

```
cosmic-museum/
├── index.html           # Landing page
├── history.html         # Timeline of discoveries
├── exoplanets.html      # Planetary systems
├── missions.html        # Space missions
├── deepspace.html       # Cosmic phenomena
├── news.html           # Latest updates
├── css/
│   └── styles.css      # All styling
└── js/
    ├── starfield.js    # Canvas animation
    └── main.js         # Page interactions
```

## How I Built This

Started with the animated starfield as the foundation - wanted something that felt alive but wasn't distracting. Used canvas for performance since CSS animations weren't cutting it for hundreds of stars.

The color scheme went through maybe 10 iterations before landing on the deep space blacks with purple/blue nebula accents. Tried to balance "this looks professional" with "this feels like you're actually in space."

Content-wise, I focused on making it accessible without dumbing it down. The exoplanet descriptions include real data but written in a way that gets you excited about these worlds rather than just listing numbers.

## Why No Framework?

Honestly? Didn't need one. The project is simple enough that adding React or Vue would just slow things down. Plus, I wanted to keep the bundle size tiny and load times fast. The whole site loads in under a second even on slower connections.

## Future Plans

Some things I'm thinking about adding:
- Search functionality across all pages
- Integration with NASA's APIs for live data
- Maybe some Three.js for 3D planet models
- Dark/light mode toggle (though space is already pretty dark)

## Contributing

If you want to improve something or add content, feel free to fork and submit a PR. I'm particularly interested in:
- Accessibility improvements
- More space phenomena for the Deep Space wing
- Performance optimizations
- Content corrections (I'm not an astrophysicist)

## Credits

Content adapted from NASA, ESA, and JPL public resources. Fonts from Google Fonts (Orbitron and Inter). The rest is just me learning as I go.

## License

MIT - do whatever you want with it. If you build something cool, let me know!

---

Built while procrastinating on other projects ✨

*December 2025*
