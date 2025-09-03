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
@use 'color-contrast-sass' as contrast; //remember that every project and framework will require a different import style. 
//Most likely, you will need to go to the node_modules folder and navigate to color-constrast-sass/index.scss
```


## Practical Examples

### Accessibility-First Button Mixin

```scss
@mixin accessible-button($bg-color, $min-contrast: 5) {
  background-color: $bg-color;
  
  // Choose text color based on contrast ratio
  @if contrast.colour-difference($bg-color, #ffffff) >= $min-contrast {
    color: #ffffff;
  } @else {
    color: #000000;
  }
  
  // Ensure border has sufficient contrast too
  @if contrast.colour-difference($bg-color, #000000) < 3 {
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

For further information, read the [CONTRIBUTING](CONTRIBUTING) file.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Transparency & AI

Some of this code was fixed by AI. I relied on AI mostly for testing and to add docs over functions, but I also used a chat bot to rubber duck problems I enounctered along the way. 

---

**Made with 💖 for accessible web development**
