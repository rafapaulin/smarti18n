const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

module.exports = class BuildCommand {
	constructor(options) {
		this.options = options;
		this.verbose = this.options.verbose
			? (...args) => console.log(chalk.gray(args))
			: () => {}
		this.locales = {};
	}

	run() {
		this.verboseCommandInfo();
		const projectSrcPath = this.getSrcPath(this.options.project);
		this.build(projectSrcPath);
		this.saveLocales(projectSrcPath);
	}

	build(buildPath) {
		this.verbose(`- ${buildPath}`);
		const list = fs.readdirSync(buildPath);
		const sep = this.separateFolders(buildPath, list);
		sep.folders.forEach(folder => this.build(folder));
		if (sep.i18n)
			this.addDataFromDir(sep.i18n);
	}

	separateFolders(basePath, list) {
		const i18npath = path.join(basePath, 'i18n');
		return {
			folders: list
				.map(entry => path.join(basePath, entry))
				.filter(fullPath =>
					fs.existsSync(fullPath)
					&& !fullPath.endsWith('i18n')
					&& !fullPath.endsWith('assets')
					&& fs.lstatSync(fullPath).isDirectory()),
			i18n: fs.existsSync(i18npath) ? i18npath : undefined
		};
	}

	addDataFromDir(i18nPath) {
		const i18nRegex = /(.*)\.i18n\.json/i;
		const list = fs.readdirSync(i18nPath);
		this.verbose(`- ${i18nPath}`);
		list.filter(f => f.endsWith('.i18n.json'))
			.map(f => ({
				locale: i18nRegex.exec(f)[1],
				filePath: path.join(i18nPath, f)
			}))
			.forEach(({locale, filePath}) => this.addDataFromFile(locale, filePath));
	}
	addDataFromFile(locale, filePath) {
		this.verbose(`    - ${filePath}`);
		if (!this.locales[locale])
			this.locales[locale] = {};
		this.writeDataToGraph(this.locales[locale], require(filePath));
	}

	writeDataToGraph(writeData, readData) {
		const orig = writeData;
		// create and navigate into base path if available
		if (readData._basePath) {
			const basePath = readData._basePath.split('.');
			basePath.forEach(p => {
				if (!writeData.hasOwnProperty(p) && p !== '_basePath') {
					writeData[p] = {};
					writeData = writeData[p];
				}
			})
		}
		// write the rest
		Object.keys(readData).forEach(k => k !== '_basePath' ? writeData[k] = readData[k] : null);
	}

	saveLocales(saveBasePath) {
		Object.keys(this.locales).forEach(locale => {
			const finalPath = path.join(saveBasePath, 'assets', 'i18n', `${locale}.i18n.json`);
			fs.outputJsonSync(finalPath, this.locales[locale]);
		});
	}

	getSrcPath(project = undefined) {
		const angularConfigPath = path.join(process.cwd(), 'angular.json');
		if (!fs.existsSync(angularConfigPath))
			throw new Error('Angular config not found');
		const angularConfig = require(angularConfigPath);
		project = project || angularConfig.defaultProject;
		this.verbose(chalk.gray(`building project ${project}...`));
		if (!angularConfig.projects[project])
			throw new Error('Invalid project');
		else return path.join(process.cwd(), angularConfig.projects[project].sourceRoot);
	}

	verboseCommandInfo() {
		if (this.options.verbose) {
			this.verbose(`running 'build' command with options:`);
			Object.keys(this.options).forEach(optKey => this.verbose(`    ${optKey}: ${this.options[optKey]}`));
		}
	}
}
