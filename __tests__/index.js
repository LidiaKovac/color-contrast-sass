const sass = require('sass');
const path = require('path');

const IMPORT_STRING = "@use 'src/sass/lib.scss' as contrast"

// Helper function to compile Sass and extract values
function compileSassFunction(functionCall) {
    const sassCode = `
    ${IMPORT_STRING};
    .test {
      content: "#{${functionCall}}";
    }
  `;

    const result = sass.compileString(sassCode, {
        loadPaths: [path.resolve(__dirname, '..')]
    });

    // Extract the content value from CSS
    const match = result.css.match(/content:\s*"([^"]+)"/);
    return match ? match[1] : null;
}

describe("Helper Functions", () => {
    describe("hsl-to-rgb", () => {
        const cases = [
            { hsl: "hsl(330, 53%, 60%)", rgb: "rgb(207, 100, 154)" },
            { hsl: "hsl(0, 100%, 50%)", rgb: "rgb(255, 0, 0)" },       // Red
            { hsl: "hsl(120, 100%, 50%)", rgb: "rgb(0, 255, 0)" },       // Green
            { hsl: "hsl(240, 100%, 50%)", rgb: "rgb(0, 0, 255)" },       // Blue
            { hsl: "hsl(60, 100%, 50%)", rgb: "rgb(255, 255, 0)" },     // Yellow
            { hsl: "hsl(180, 100%, 50%)", rgb: "rgb(0, 255, 255)" },     // Cyan
        ];

        cases.forEach(({ hsl, rgb }) => {
            test(`should return RGB close to ${rgb} for ${hsl}`, () => {
                const [or, og, ob] = rgb.match(/\d+/g).map(Number);
                const result = compileSassFunction(`contrast.hsl-to-rgb(${hsl})`);
                const [r, g, b] = result.match(/\d+/g).map(Number);
                // allowing for 2 points of tolerance
                expect(Math.abs(r - or)).toBeLessThanOrEqual(2);
                expect(Math.abs(g - og)).toBeLessThanOrEqual(2);
                expect(Math.abs(b - ob)).toBeLessThanOrEqual(2);
            });
        });
    })
})

describe('Contrast Functions', () => {
    describe('colour-difference()', () => {
        test('should return 21 for maximum contrast (black on white)', () => {
            const result = compileSassFunction('contrast.colour-difference(#000000, #ffffff)');
            expect(parseFloat(result)).toBeCloseTo(21, 1);
        });

        test('should return 1 for same colors', () => {
            const result = compileSassFunction('contrast.colour-difference(#ff0000, #ff0000)');
            expect(parseFloat(result)).toBeCloseTo(1, 2);
        });

        test('should return same result regardless of color order', () => {
            const result1 = compileSassFunction('contrast.colour-difference(#000000, #ffffff)');
            const result2 = compileSassFunction('contrast.colour-difference(#ffffff, #000000)');
            expect(parseFloat(result1)).toBeCloseTo(parseFloat(result2), 2);
        });

        test('should handle typical web colors correctly', () => {
            // Test common color combinations
            const testCases = [
                { colors: '#0066cc, #ffffff', expectedMin: 4.5 }, // Should pass WCAG AA
                { colors: '#666666, #ffffff', expectedMin: 3.0 },
                { colors: '#ff0000, #ffffff', expectedMin: 3.0 }
            ];

            testCases.forEach(({ colors, expectedMin }) => {
                const result = compileSassFunction(`contrast.colour-difference(${colors})`);
                expect(parseFloat(result)).toBeGreaterThan(expectedMin);
            });
        });

        test('should work with different color formats', () => {
            const hexResult = compileSassFunction('contrast.colour-difference(#000000, #ffffff)');
            const rgbResult = compileSassFunction('contrast.colour-difference(rgb(0,0,0), rgb(255,255,255))');
            const hslResult = compileSassFunction('contrast.colour-difference(hsl(0,0%,0%), hsl(0,0%,100%))');

            expect(parseFloat(hexResult)).toBeCloseTo(parseFloat(rgbResult), 1);
            expect(parseFloat(hexResult)).toBeCloseTo(parseFloat(hslResult), 1);
        });
    });

    describe('relative-luminance()', () => {
        test('should return 1 for white', () => {
            const result = compileSassFunction('contrast.relative-luminance(#ffffff)');
            expect(parseFloat(result)).toBeCloseTo(1, 2);
        });

        test('should return 0 for black', () => {
            const result = compileSassFunction('contrast.relative-luminance(#000000)');
            expect(parseFloat(result)).toBeCloseTo(0, 2);
        });

        test('should return values between 0 and 1 for other colors', () => {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#808080', '#ffff00'];

            colors.forEach(color => {
                const result = compileSassFunction(`contrast.relative-luminance(${color})`);
                const luminance = parseFloat(result);
                expect(luminance).toBeGreaterThanOrEqual(0);
                expect(luminance).toBeLessThanOrEqual(1);
            });
        });

        test('should handle edge cases', () => {
            // Very dark gray
            const darkGray = compileSassFunction('contrast.relative-luminance(#010101)');
            expect(parseFloat(darkGray)).toBeCloseTo(0, 1);

            // Very light gray
            const lightGray = compileSassFunction('contrast.relative-luminance(#fefefe)');
            expect(parseFloat(lightGray)).toBeCloseTo(1, 1);
        });
    });

    describe('colour-difference()', () => {
        test('should be an alias for colour-difference', () => {
            const contrastResult = compileSassFunction('contrast.colour-difference(#000000, #ffffff)');
            const differenceResult = compileSassFunction('contrast.colour-difference(#000000, #ffffff)');

            expect(parseFloat(contrastResult)).toBeCloseTo(parseFloat(differenceResult), 2);
        });
    });

    describe('WCAG Compliance Tests', () => {
        test('should identify WCAG AA compliant combinations', () => {
            const wcagAACombinations = [
                '#000000, #ffffff', // 21:1
                '#0066cc, #ffffff', // ~7.3:1
                '#333333, #ffffff'  // ~12.6:1
            ];

            wcagAACombinations.forEach(colors => {
                const result = compileSassFunction(`contrast.colour-difference(${colors})`);
                expect(parseFloat(result)).toBeGreaterThanOrEqual(4.5);
            });
        });

        test('should identify non-compliant combinations', () => {
            const nonCompliantCombinations = [
                '#ffff00, #ffffff', // Yellow on white - poor contrast
                '#cccccc, #ffffff', // Light gray on white - poor contrast
            ];

            nonCompliantCombinations.forEach(colors => {
                const result = compileSassFunction(`contrast.colour-difference(${colors})`);
                expect(parseFloat(result)).toBeLessThan(4.5);
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle compilation errors gracefully', () => {
            expect(() => {
                compileSassFunction('contrast.nonexistent-function(#000, #fff)');
            }).toThrow();
        });

        test('should work with CSS custom properties', () => {
            // This might not work directly, but good to test
            const sassCode = `
        ${IMPORT_STRING};
        :root {
          --bg: #ffffff;
          --text: #000000;
        }
        .test {
          --contrast: #{contrast.colour-difference(#000000, #ffffff)};
        }
      `;

            expect(() => {
                sass.compileString(sassCode, {
                    loadPaths: [path.resolve(__dirname, '..')]
                });
            }).not.toThrow();
        });
    });
});