# Sass Style Guidelines

## File Organization

### File Naming

- Use lowercase with hyphens: `contrast-functions.scss`
- Private files start with underscore: `_helpers.scss`
- Main entry point: `index.scss`

### Directory Structure

**tests**/ ├──index.js src/ ├── \_functions.scss │index.scss

## Code Style

### Indentation

- Please use tabs, not spaces.
- Consistent nesting depth.

If you use Prettier, just make sure you're using the .prettierrc file I added to
the repo.

### Comments

```scss
// Single-line comments for brief explanations
/* Multi-line comments for detailed documentation */

/**
 * Function: contrast-ratio
 * Purpose: Calculate WCAG contrast ratio between two colors
 * @param {Color} $color1 - First color
 * @param {Color} $color2 - Second color
 * @return {Number} - Contrast ratio (1-21)
 */
```

### Variable naming

```sass
// Use descriptive, kebab-case names
$wcag-aa-threshold: 4.5;
$wcag-aaa-threshold: 7;
$luminance-threshold: 0.03928;

// Avoid abbreviations
$contrast-ratio: 4.5;        // ✅ Good
$cr: 4.5;                    // ❌ Bad
```

### Function naming

```sass
// Use descriptive, action-oriented names
@function contrast-ratio() { }     // ✅ Good
@function get-contrast() { }       // ✅ Good
@function calc-cr() { }            // ❌ Bad

// Private functions use underscore prefix
@function _linearize-channel() { } // ✅ Private helper
```

### Code formatting

```sass
// Spaces around operators
$result: ($light + 0.05) / ($dark + 0.05);  // ✅ Good
$result: ($light+0.05)/($dark+0.05);        // ❌ Bad

// Function calls with clear parameter spacing
contrast-ratio(#000000, #ffffff);           // ✅ Good
contrast-ratio(#000000,#ffffff);            // ❌ Bad

// Consistent bracket placement
@function example($param) {                  // ✅ Good
  @return $param * 2;
}

@function example($param){                   // ❌ Bad
  @return $param*2;}
```

### Errors
Where necessary add error handling: 
```sass
@use "sass:meta";

@function contrast-ratio($color1, $color2) {
  // Validate inputs
  @if meta.type-of($color1) != 'color' {
    @error "contrast-ratio: $color1 must be a color, got #{meta.type-of($color1)}";
  }
  
  @if meta.type-of($color2) != 'color' {
    @error "contrast-ratio: $color2 must be a color, got #{meta.type-of($color2)}";
  }
  
  // Function logic here
}
```