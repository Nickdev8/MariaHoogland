# Maria Hoogland Architectuur

A static-content portfolio site built with SvelteKit.

## Edit content

Edit `app/defaults.json` in VS Code:

- `home` controls the homepage.
- `about`, `contact`, and `footer` control their corresponding pages.
- `projects` controls the portfolio grid and individual project pages.

Place images in `app/static/images/` and videos in `app/static/videos/`. Reference them in JSON with paths such as `/images/projects/example.jpeg` or `/videos/example.mp4`.

See [CONTENT_EDITING.md](CONTENT_EDITING.md) for the short editing guide.

## Local development

```bash
cd app
npm install
npm run dev
```

## Docker

```bash
docker compose up -d --build
```

`docker-compose.yml` mounts `./app/defaults.json`, `./app/static/images/`, and `./app/static/videos/` into the running container as read-only. Changes made to the JSON or media folders on the server are used on the next page request; rebuilding or restarting the container is not necessary for content or media changes.

Rebuild only when the application code or dependencies change:

```bash
docker compose up -d --build
```
