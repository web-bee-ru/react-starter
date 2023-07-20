import chalk from 'chalk';
import path from 'node:path';
import copyFiles from '../helpers/copy-files';
import { install } from '../helpers/install';
import { PackageManager } from '../helpers/get-pkg-manager';

export const getTemplateFile = ({ template, file }: any): string => {
  return path.join(__dirname, template, file);
};

/**
 * Install a template to a given `root` directory.
 */
export const installTemplate = async ({
  appName,
  root,
  packageManager,
  isOnline,
  template,
  tailwind,
  css,
  turbo,
  eslint,
  importAlias,
}: {
  appName: string;
  root: string;
  packageManager: PackageManager;
  isOnline: boolean;
  template: string;
  tailwind: boolean;
  css: string;
  turbo: boolean;
  eslint: boolean;
  importAlias: string;
}) => {
  console.log(chalk.bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log('\nInitializing project with template:', template, '\n');
  await copyFiles(template, root, __dirname, eslint, tailwind, turbo);

  /**
   * Install package.json dependencies if they exist.
   */
  console.log();
  console.log('Installing package.json dependencies to', root);
  const installFlags = { packageManager, isOnline };
  const dependencies: string[] = [];
  if (css === 'css-in-js') {
    dependencies.push('styled-components@latest');
  } else {
    dependencies.push('sass');
    if (template === 'react-webpack-starter') {
      dependencies.push('sass-loader');
    }
  }

  /**
   * Add Tailwind CSS dependencies.
   */
  if (tailwind) {
    dependencies.push('tailwindcss', 'postcss', 'autoprefixer');
  }
  if (dependencies.length) {
    await install(root, dependencies, installFlags);
  }
  await install(root, [], installFlags);
};
