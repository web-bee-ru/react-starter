#!/usr/bin/env node

import prompts from 'prompts';
import chalk from 'chalk';
import path from 'node:path';
import fs from 'node:fs';
import Commander from 'commander';
import packageJson from './package.json';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { getPkgManager } from './helpers/get-pkg-manager';
import { createApp } from './create-app';

let projectPath: string = '';
const cssVariants = [
  { title: 'css-in-js', value: 'css-in-js' },
  { title: 'saas', value: 'saas' },
];

const templateVariants = [
  { title: 'webpack', value: 'react-webpack-starter' },
  { title: 'vite', value: 'react-vite-starter' },
  { title: 'next js', value: 'next-starter' },
];

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .option(
    '--template [app-template]',
    `
    
    Select build tool to bootstrap your app. 
    Available:
        react-webpack-starter
        react-vite-starter
        next-starter
`,
  )
  .option(
    '--tailwind <boolean>',
    `

  Initialize with Tailwind CSS config.
`,
    true,
  )
  .option(
    '--eslint <boolean>',
    `

  Initialize with eslint config.
`,
    true,
  )
  .option(
    '--turbo',
    `

  Initialize with turbo config.
`,
  )
  .option(
    '--use-npm',
    `

  Explicitly tell the CLI to bootstrap the application using npm
`,
  )
  .option(
    '--use-pnpm',
    `

  Explicitly tell the CLI to bootstrap the application using pnpm
`,
  )
  .option(
    '--use-yarn',
    `

  Explicitly tell the CLI to bootstrap the application using Yarn
`,
  )
  .option(
    '--css [css-type]',
    `

    Sets the way to work with css.     
    Available: 
        saas
        css-in-js
`,
  )
  .allowUnknownOption()
  .allowExcessArguments()
  .parse(process.argv);
const options = program.opts();
const packageManager = !!options.useNpm
  ? 'npm'
  : !!options.usePnpm
  ? 'pnpm'
  : !!options.useYarn
  ? 'yarn'
  : getPkgManager();

async function run(): Promise<void> {
  const resolvedProjectPath = path.resolve(projectPath);
  const root = path.resolve(resolvedProjectPath);
  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const { css } = await prompts(
    {
      type: 'select',
      name: 'css',
      message: `How do you prefer to work with ${chalk.hex('#007acc')('css')}?`,
      initial: 0,
      choices: cssVariants,
    },
    {
      /**
       * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
       * process and not write to the file system.
       */
      onCancel: () => {
        console.error('Exiting.');
        process.exit(1);
      },
    },
  );
  /**
   * Depending on the prompt response, set the appropriate command flags.
   */
  options.css = css;

  if (typeof options.turbo === 'undefined') {
    const { turbo } = await prompts(
      {
        type: 'toggle',
        name: 'turbo',
        message: `Would you like to use ${chalk.hex('#007acc')('turbo')} with this project?`,
        initial: false,
        active: 'Yes',
        inactive: 'No',
      },
      {
        /**
         * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
         * process and not write to the file system.
         */
        onCancel: () => {
          console.error('Exiting.');
          process.exit(1);
        },
      },
    );
    /**
     * Depending on the prompt response, set the appropriate options flags.
     */
    options.turbo = turbo;
  }

  if (!options.template) {
    const { template } = await prompts(
      {
        type: 'select',
        name: 'template',
        message: `Which app ${chalk.hex('#007acc')('template')} do you prefer`,
        initial: 0,
        choices: templateVariants,
      },
      {
        /**
         * User inputs Ctrl+C or Ctrl+D to exit the prompt. We should close the
         * process and not write to the file system.
         */
        onCancel: () => {
          console.error('Exiting.');
          process.exit(1);
        },
      },
    );
    /**
     * Depending on the prompt response, set the appropriate options flags.
     */
    options.template = template;
  }

  await createApp({
    appPath: resolvedProjectPath,
    packageManager: packageManager,
    turbo: options.turbo,
    template: options.template,
    eslint: options.eslint,
    css: options.css,
    tailwind: options.tailwind,
    importAlias: options.importAlias,
  });
}

run();
