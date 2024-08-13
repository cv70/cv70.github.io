# AGENTS.md - Guidelines for AI Coding Agents

## Repository Overview

This is a collection of vanilla JavaScript games and frontend tools hosted on GitHub Pages. No build system is required - everything runs directly in the browser.

## Project Structure

```
/home/o/space/cv70.github.io/
├── assets/              # Shared assets (CSS, images)
├── game/                # Browser games
│   ├── snake/           # Snake game
│   ├── plane/           # Shooting game
│   ├── five-chess/      # Gomoku/Five-in-a-Row
│   ├── tetris/          # Tetris
│   ├── canvas/          # Canvas drawing editor
│   └── gopher-mole/     # Whack-a-mole style game
├── tool/                # Web tools
│   ├── md/              # Markdown editor
│   └── html/            # HTML tools
├── tips/                # Donation/tip info
├── index.html           # Main landing page
└── template.html        # HTML template
```

## Build/Lint/Test Commands

### Development
- **No build step required** - All files are plain HTML/CSS/JS
- **Serve locally**: Use any static server
  ```bash
  # Python
  python -m http.server 8000
  
  # Node.js (if npx available)
  npx serve .
  
  # PHP
  php -S localhost:8000
  ```

### Testing
- **No automated tests** - All games are manually tested in browser
- To test a single game: Open the game's `index.html` in a browser
  ```bash
  # Open snake game
  open game/snake/index.html  # macOS
  # or
  xdg-open game/snake/index.html  # Linux
  ```

### Deployment
```bash
# Deploy script (git.sh)
sh git.sh
# Or manually:
git add .
git commit -m "update"
git push origin main
```

## Code Style Guidelines

### JavaScript

**File Structure:**
- Use ES5/ES6 mixed syntax (function declarations, classes)
- No modules - everything is global scope
- Functions declared at top level

**Naming Conventions:**
- Functions: `camelCase` (e.g., `updateSnake`, `gameOver`, `calculateDirection`)
- Classes: `PascalCase` (e.g., `Player`, `Controls`)
- Variables: `camelCase` (e.g., `gameRunning`, `nextDirection`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `PLAYER_SPEED`, `BULLET_CREATE_INTERVAL`)

**Code Patterns:**
```javascript
// Function declarations (preferred)
function gameOver() {
    gameRunning = false;
    alert(`游戏结束！最终得分：${score}`);
}

// Classes with extends
class Player extends Img {
    constructor(imgSrc, speed) {
        super(imgSrc)
        this.hp = 100
        this.speed = speed
    }
}

// Global scope exposure
window.updateSnake = updateSnake;
window.drawSnake = drawSnake;
```

**Error Handling:**
- Minimal error handling - assume valid input
- Use `alert()` for game over/user feedback
- Collision detection via conditional returns

**Comments:**
- Chinese comments for game logic
- English comments for general code
- Explain algorithm logic (e.g., AI scoring)

### CSS

**Organization:**
- Scoped CSS per game/tool
- Class names: `kebab-case` (e.g., `#game-container`, `.tips`)
- ID selectors for unique elements

**Patterns:**
```css
/* Reset and base */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Responsive breakpoints */
@media (max-width: 768px) { /* mobile */ }
@media (max-width: 480px) { /* small mobile */ }

/* Dark mode support */
body.dark-mode { /* styles */ }
```

**Styling conventions:**
- Use flexbox for layout
- Smooth transitions (`transition: all 0.3s ease`)
- Hover effects with `transform`
- Box shadows for depth

### HTML

**Structure:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/path/to/style.css">
</head>
<body>
    <!-- Content -->
    <script src="/path/to/script.js"></script>
</body>
</html>
```

**Best Practices:**
- UTF-8 encoding
- Responsive viewport meta tag
- External CSS/JS files
- Semantic HTML5 tags (`<header>`, `<main>`, `<article>`, `<footer>`)

## Common Patterns

### Game Loop Pattern
```javascript
function gameLoop() {
    if (!gameRunning) return;
    setTimeout(() => {
        updateGame();
        drawGame();
        gameLoop();
    }, gameSpeed);
}
```

### Collision Detection
```javascript
// Grid-based collision
if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
}
```

### Class Extension Pattern
```javascript
class Child extends Parent {
    constructor(...) {
        super(...)
        this.newProperty = value
    }
}
```

## When Adding New Features

1. **Check existing patterns** - Follow the style of similar games/tools
2. **No new dependencies** - Use vanilla JS only
3. **Mobile responsive** - Ensure CSS works on mobile
4. **Dark mode** - Consider dark mode styling
5. **Chinese comments** - Add comments for complex logic
6. **Test in browser** - Manually verify functionality

## File Naming

- JavaScript: `snake_case.js` or `camelCase.js` (e.g., `script.js`, `main.js`, `ai.js`)
- CSS: `kebab-case.css` or `snake_case.css` (e.g., `style.css`, `style.css`)
- HTML: `kebab-case.html` (e.g., `index.html`, `template.html`)

## Important Notes

- **No TypeScript** - Pure JavaScript only
- **No build tools** - No webpack, rollup, etc.
- **No package.json** - No npm dependencies
- **GitHub Pages** - Deployed via git push to main branch
- **Global scope** - All functions/variables are globally accessible
- **Canvas games** - Most games use HTML5 Canvas API
