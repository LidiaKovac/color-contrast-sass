# Sass Contrast Functions

A lightweight Sass library providing WCAG-compliant color contrast calculation functions for accessible web development.

## Features

- 🎯 **WCAG Compliant**: Calculate contrast ratios according to Web Content Accessibility Guidelines
- 🧮 **Precise Calculations**: Uses scientific relative luminance formulas for accurate results
- 🎨 **Color Accessibility**: Ensure your color combinations meet accessibility standards
- 📦 **Zero Dependencies**: Pure Sass implementation with no external dependencies
- ⚡ **Customizable**: The library returns the contrast ratio, you decide at which threshold to apply changes

## Installation

```bash
npm install color-contrast-sass
```

## Usage

### Basic Import

```scss
@use 'color-contrast-sass' as contrast;
```

### Available Functions


#### `colour-difference($color1, $color2)`

Alias for `contrast-ratio()` - same functionality with alternative spelling.

```scss
$difference: contrast.colour-difference(#ff0000, #00ff00);
// Returns: contrast ratio between red and green
```

## Practical Examples

### Accessibility-First Button Mixin

```scss
@use 'color-contrast-sass' as contrast;

@mixin accessible-button($bg-color, $min-contrast: 4.5) {
  background-color: $bg-color;
  
  // Choose text color based on contrast ratio
  @if contrast.contrast-ratio($bg-color, #ffffff) >= $min-contrast {
    color: #ffffff;
  } @else {
    color: #000000;
  }
  
  // Ensure border has sufficient contrast too
  @if contrast.contrast-ratio($bg-color, #000000) < 3 {
    border: 1px solid #666666;
  }
}

.primary-button {
  @include accessible-button(#0066cc); // Blue background
}

.warning-button {
  @include accessible-button(#ffcc00); // Yellow background
}
```

### Dynamic Theme Colors

```scss
@use 'color-contrast-sass' as contrast;

$brand-color: #7b68ee;
$background: #f8f9fa;

.card {
  background-color: $background;
  
  // Automatically choose heading color based on contrast
  .card-title {
    @if contrast.contrast-ratio($brand-color, $background) >= 4.5 {
      color: $brand-color;
    } @else {
      color: darken($brand-color, 20%);
    }
  }
}
```

### Accessibility Validation Helper

```scss
@use 'color-contrast-sass' as contrast;

@function meets-wcag-aa($foreground, $background, $large-text: false) {
  $required-ratio: if($large-text, 3, 4.5);
  $actual-ratio: contrast.contrast-ratio($foreground, $background);
  
  @return $actual-ratio >= $required-ratio;
}

@function meets-wcag-aaa($foreground, $background, $large-text: false) {
  $required-ratio: if($large-text, 4.5, 7);
  $actual-ratio: contrast.contrast-ratio($foreground, $background);
  
  @return $actual-ratio >= $required-ratio;
}

// Usage
.text-normal {
  color: #333333;
  background: #ffffff;
  
  @if not meets-wcag-aa(#333333, #ffffff) {
    @warn "Text color does not meet WCAG AA standards!";
  }
}
```

## WCAG Contrast Standards

| Level | Normal Text | Large Text (18pt+) |
|-------|-------------|-------------------|
| **AA** | 4.5:1 | 3:1 |
| **AAA** | 7:1 | 4.5:1 |

### Understanding Contrast Ratios

- **21:1** - Maximum contrast (black on white)
- **7:1** - WCAG AAA standard for normal text
- **4.5:1** - WCAG AA standard for normal text
- **3:1** - WCAG AA standard for large text
- **1:1** - No contrast (same color)

## Advanced Usage

### Color Palette Generator

```scss
@use 'color-contrast-sass' as contrast;

@function generate-accessible-palette($base-color, $background: #ffffff) {
  $palette: ();
  
  // Generate shades until we find accessible ones
  @for $i from 1 through 9 {
    $shade: mix(#000000, $base-color, $i * 10%);
    @if contrast.contrast-ratio($shade, $background) >= 4.5 {
      $palette: map-merge($palette, (
        "shade-#{$i}": $shade
      ));
    }
  }
  
  @return $palette;
}
```

### Debugging Contrast Issues

```scss
@use 'color-contrast-sass' as contrast;

@mixin debug-contrast($foreground, $background) {
  $ratio: contrast.contrast-ratio($foreground, $background);
  
  @debug "Contrast ratio: #{$ratio}";
  @debug "WCAG AA compliant: #{$ratio >= 4.5}";
  @debug "WCAG AAA compliant: #{$ratio >= 7}";
}

.my-component {
  color: #666666;
  background: #f0f0f0;
  
  @include debug-contrast(#666666, #f0f0f0);
}
```

## Browser Support

This library uses standard Sass functions and is compatible with:
- Dart Sass 1.23.0+
- Any build tool that supports modern Sass (Webpack, Vite, Parcel, etc.)

## Contributing

You are free and encouraged to contribute or open an issue. The purpose of this library is not to show off but to offer a tool. The more people contribute to making it usable, the better! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

---

**Made with ♿ for accessible web development**
