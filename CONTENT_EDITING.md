# Editing the website

Edit site content in `app/defaults.json`.

- `home` controls the homepage.
- `about` controls the About page and Maria's portrait.
- `contact` and `footer` control the contact details.
- `projects` controls the Portfolio grid and every individual project page.

Put images in `app/static/images/` and videos in `app/static/videos/`. Use paths such as `/images/projects/example.jpeg` or `/videos/example.mp4` in `defaults.json`.

The untouched source files for optimized media live in `app/static/images/source/originals/`. Keep them there; use the smaller WebP files in page content.

Keep the JSON valid: keys and text use double quotes, and items are separated by commas. The development server refreshes after saving; run `npm run build` before publishing.
