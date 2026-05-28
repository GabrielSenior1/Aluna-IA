/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        // Colors from user image
        "primary": "#007AFF",
        "secondary": "#30B0C7",
        "tertiary": "#D75600",
        "neutral": "#8E8E93",
        // Other colors from user config
        "error": "#ba1a1a",
        "secondary-fixed": "#a5eeff",
        "tertiary-fixed": "#ffdbcc",
        "primary-container": "#0070eb",
        "on-error": "#ffffff",
        "on-background": "#1a1b1f",
        "surface-bright": "#faf9fe",
        "on-secondary-fixed-variant": "#004e5a",
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#ffb595",
        "on-tertiary-fixed": "#351000",
        "error-container": "#ffdad6",
        "inverse-primary": "#adc6ff",
        "secondary-fixed-dim": "#61d6ee",
        "on-error-container": "#93000a",
        "on-surface-variant": "#414755",
        "background": "#faf9fe",
        "on-primary": "#ffffff",
        "inverse-on-surface": "#f1f0f5",
        "outline": "#717786",
        "on-secondary-container": "#006776",
        "surface-container-low": "#f4f3f8",
        "on-primary-fixed": "#001a41",
        "on-tertiary-fixed-variant": "#7c2e00",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#c64f00",
        "primary-fixed": "#d8e2ff",
        "surface-dim": "#dad9df",
        "surface-container-highest": "#e3e2e7",
        "inverse-surface": "#2f3034",
        "on-secondary-fixed": "#001f25",
        "outline-variant": "#c1c6d7",
        "surface-container-high": "#e9e7ed",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e3e2e7",
        "on-primary-container": "#fefcff",
        "surface-tint": "#005bc1",
        "surface-container": "#eeedf3",
        "surface": "#faf9fe",
        "on-tertiary-container": "#fffbff",
        "on-primary-fixed-variant": "#004493",
        "secondary-container": "#74e7ff",
        "on-surface": "#1a1b1f",
        "primary-fixed-dim": "#adc6ff",
        "success": "#16a34a",
        "warning": "#d97706"
      },
      "borderRadius": {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      "spacing": {
        "gutter": "16px",
        "stack-lg": "24px",
        "stack-sm": "8px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        "unit": "8px",
        "stack-md": "16px"
      },
      "fontFamily": {
        "label-caps": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"]
      },
      "fontSize": {
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.5px", "fontWeight": "600" }],
        "body-lg": ["17px", { "lineHeight": "22px", "letterSpacing": "-0.4px", "fontWeight": "400" }],
        "headline-md": ["22px", { "lineHeight": "28px", "letterSpacing": "-0.4px", "fontWeight": "600" }],
        "headline-lg": ["28px", { "lineHeight": "34px", "letterSpacing": "-0.4px", "fontWeight": "700" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "30px", "fontWeight": "700" }],
        "body-sm": ["15px", { "lineHeight": "20px", "letterSpacing": "-0.2px", "fontWeight": "400" }],
        "display-lg-mobile": ["28px", { "lineHeight": "34px", "fontWeight": "700" }],
        "display-lg": ["34px", { "lineHeight": "41px", "letterSpacing": "-0.4px", "fontWeight": "700" }]
      }
    }
  },
  plugins: [],
}
