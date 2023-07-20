import chalk from 'chalk';
import { PackageManager } from './helpers/get-pkg-manager';
import { tryGitInit } from './helpers/git';
import { installTemplate } from './templates/index';
import path from 'path';
import fs from 'fs';
import { getOnline } from './helpers/get-online';
import { isWriteable } from './helpers/is-writeable';
import { makeDir } from './helpers/make-dir';
import { isFolderEmpty } from './helpers/is-folder-empty';

export async function createApp({
  appPath,
  packageManager,
  css,
  turbo,
  tailwind,
  template,
  eslint,
  importAlias,
}: {
  appPath: string;
  packageManager: PackageManager;
  css: string;
  turbo: boolean;
  tailwind: boolean;
  template: string;
  eslint: boolean;
  importAlias: string;
}): Promise<void> {
  const root = path.resolve(appPath);

  const useYarn = packageManager === 'yarn';
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  if (!(await isWriteable(path.dirname(root)))) {
    console.error('The application path is not writable, please check folder permissions and try again.');
    console.error('It is likely you do not have write permissions for this folder.');
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  process.chdir(root);

  let hasPackageJson = false;

  await installTemplate({
    appName,
    root,
    template,
    packageManager,
    isOnline,
    css,
    turbo,
    tailwind,
    eslint,
    importAlias,
  });

  const packageJsonPath = path.join(root, 'package.json');
  hasPackageJson = fs.existsSync(packageJsonPath);

  if (tryGitInit(root)) {
    console.log('Initialized a git repository to', root);
    console.log();
  }

  let cdpath: string;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  if (hasPackageJson) {
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build`));
    console.log('    Builds the app for production.');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} start`));
    console.log('    Runs the built app in production mode.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan('  cd'), cdpath);
    console.log(`  ${chalk.cyan(`${packageManager} ${useYarn ? '' : 'run '}dev`)}`);
  }
  console.log();
}
