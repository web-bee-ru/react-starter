import cpy from 'cpy';
import fs from 'fs';
import path from 'path';

export default async function copyFiles(
  template: string,
  root: string,
  rootDir: string,
  eslint: boolean,
  tailwind: boolean,
  turbo: boolean,
): Promise<void> {
  //TODO: delete all the dots from the beginning of the file name or directory because "cpy" does not copy such files.
  //After copying, we return them to the beginning

  const validFiles = ['.DS_Store', '.husky', '.idea'];

  const templatePath = path.join(rootDir, template);
  console.log('templatePath', templatePath);

  const copySource = ['**'];
  const hiddenFiles: string[] = [];
  if (!eslint) copySource.push('!eslintrc.json');
  if (!tailwind) copySource.push('!tailwind.config.js', '!postcss.config.js');
  if (!turbo) copySource.push('!turbo.json');

  const files = fs.readdirSync(templatePath);
  files
    .filter((file) => {
      return file.match(/^\./);
    })
    .forEach((file) => {
      if (validFiles.indexOf(file) !== -1) return;

      const fileNoDots = file.replace(/^\./, '');
      hiddenFiles.push(fileNoDots);
      const filePath = path.join(templatePath, file),
        newFilePath = path.join(templatePath, fileNoDots);

      fs.renameSync(filePath, newFilePath);
    });

  await cpy(copySource, root, {
    parents: true,
    cwd: templatePath,
    rename: (name) => {
      if (hiddenFiles.indexOf(name) !== -1 || name === 'gitignore') return '.'.concat(name);

      return name;
    },
  });

  hiddenFiles.forEach((file) => {
    const filePath = path.join(templatePath, file),
      newFilePath = path.join(templatePath, '.'.concat(file));

    fs.renameSync(filePath, newFilePath);
  });
}
