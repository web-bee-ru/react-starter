# Create web-bee App

The easiest way to get started with our templates is by using `create-webbee-app`. This CLI tool enables you to quickly start building a new application, with everything set up for you.

### Interactive

You can create a new project interactively by running:

```bash
npx create-webbee-app myDir
```

### Non-interactive

You can also pass command line arguments to set up a new project
non-interactively. See `create-webbe-app --help`:

```bash
Usage: create-webbee-app <project-directory> [options]

Options:
  -V, --version              output the version number
  --template [app-template]

      Select build tool to bootstrap your app.
      Available:
          react-webpack-starter
          react-vite-starter
          next-starter

  --tailwind <boolean>

    Initialize with Tailwind CSS config.
   (default: true)
  --eslint <boolean>

    Initialize with eslint config.
   (default: true)
  --turbo

    Initialize with turbo config.
   (default: true)
  --use-npm

    Explicitly tell the CLI to bootstrap the application using npm

  --use-pnpm

    Explicitly tell the CLI to bootstrap the application using pnpm

  --use-yarn

    Explicitly tell the CLI to bootstrap the application using Yarn

  --css [css-type]

      Sets the way to work with css.
      Available:
          saas
          css-in-js

  -h, --help                 display help for command
```
