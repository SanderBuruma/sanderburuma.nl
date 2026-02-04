---
phase: quick
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/blog/minesweeper.md
autonomous: true

must_haves:
  truths:
    - "Reader understands what 4D minesweeper is"
    - "Reader understands how the grid is visualized"
    - "Reader has actionable strategy tips"
  artifacts:
    - path: "src/content/blog/minesweeper.md"
      provides: "Blog post about 4D minesweeper"
      min_lines: 80
  key_links:
    - from: "src/content/blog/minesweeper.md"
      to: "portfolio page"
      via: "link to play the game"
      pattern: "/portfolio.*minesweeper"
---

<objective>
Write a blog article introducing 4D Minesweeper - not a technical deep-dive, but a friendly introduction explaining the concept and providing strategy tips.

Purpose: Add engaging content about an interesting portfolio piece
Output: `src/content/blog/minesweeper.md`
</objective>

<execution_context>
@/home/sanderburuma/.claude/get-shit-done/workflows/execute-plan.md
@/home/sanderburuma/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/content/blog/hello-world.md (example blog format with frontmatter)
@src/content/blog/summarize-yt.md (example blog tone and structure)
@src/sections/MinesweeperSection.jsx (the actual 4D minesweeper implementation)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write minesweeper.md blog article</name>
  <files>src/content/blog/minesweeper.md</files>
  <action>
Create a blog post with the following structure:

**Frontmatter:**
- title: Something engaging about 4D Minesweeper
- date: 2026-02-04
- description: Brief compelling description
- image: /images/blog/Minesweeper-1.jpg (already exists)
- tags: games, puzzle, portfolio
- author: Sander Buruma

**Content to cover (non-technical, conversational tone):**

1. **Introduction** - Hook the reader with "what if minesweeper had more dimensions?"

2. **What is 4D Minesweeper?**
   - Regular minesweeper is 2D (X-Y grid)
   - This version adds two more dimensions (Z and W)
   - The grid is 4x4x4x4 = 256 total cells
   - Each cell can have up to 80 neighbors (3^4 - 1) instead of 8

3. **How to Read the Grid**
   - Displayed as a 4x4 arrangement of 4x4 mini-grids
   - Each mini-grid represents one "slice" of the 4D space
   - Moving horizontally between mini-grids = moving in Z
   - Moving vertically between mini-grids = moving in W
   - Within each mini-grid: X (horizontal) and Y (vertical)

4. **Game Mechanics**
   - Left-click to reveal cells (same as classic)
   - Right-click to flag suspected mines
   - Numbers show adjacent mines across ALL 4 dimensions
   - Numbers auto-update as you place flags (shows remaining unflagged mines)
   - Drag-select to reveal multiple cells at once (unique feature)
   - Auto-reveal when a cell's count reaches zero

5. **Strategy Tips** (the meaty part)
   - Start from revealed zeros - they cascade automatically
   - Think in "slices" - a cell in mini-grid (1,2) is adjacent to cells in mini-grids (0,1), (0,2), (0,3), (1,1), (1,3), (2,1), (2,2), (2,3) - basically the 3x3 area around it
   - Corner cells of corner mini-grids have fewer neighbors (fewer potential mines)
   - Edge cells of the entire 4D space are safer starting points
   - Use the flag-adjusted numbers - when you flag, adjacent numbers decrease
   - The drag-select feature helps clear safe areas quickly
   - Difficulty increases as you win (starts at 20 mines, goes up)

6. **Call to Action**
   - Link to play: [Play it on my portfolio](/portfolio#minesweeper)
   - Casual closing

**Tone:** Similar to summarize-yt.md - practical, friendly, gets to the point. Not academic. Use "you" language.

**Do NOT include:**
- Code snippets or technical implementation details
- React/JavaScript discussion
- Over-explanation of what minesweeper is (assume reader knows basics)
  </action>
  <verify>
- File exists at src/content/blog/minesweeper.md
- Frontmatter has all required fields (title, date, description, image, tags, author)
- Image path matches existing file: /images/blog/Minesweeper-1.jpg
- Contains link to portfolio with minesweeper anchor
- Word count ~600-1000 (readable length, not too long)
  </verify>
  <done>
- Blog post exists with proper frontmatter
- Non-technical introduction to 4D minesweeper concept
- Grid visualization explained
- Strategy tips included
- Link to play the game
  </done>
</task>

</tasks>

<verification>
- `cat src/content/blog/minesweeper.md` shows complete article
- Frontmatter parses correctly (has opening/closing ---)
- Image file exists: `ls public/images/blog/Minesweeper-1.jpg`
</verification>

<success_criteria>
- Blog post complete and properly formatted
- Reader can understand 4D minesweeper without code knowledge
- Contains actionable strategy tips
- Links to the actual game on portfolio
</success_criteria>

<output>
After completion, create `.planning/quick/001-write-minesweeper-blog-article/001-SUMMARY.md`
</output>
