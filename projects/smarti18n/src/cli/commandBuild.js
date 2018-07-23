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
		this.build(this.getSrcPath(this.options.project));
	}

	build(buildPath) {
		this.verbose(`- ${buildPath}`);
		fs.readdir(buildPath, (err, list) => {
			if (err) throw new Error(err);
			const sep = this.separateFolders(buildPath, list);
			sep.folders.forEach(folder => this.build(folder));
			if (sep.i18n)
				this.addDataFrom(sep.i18n);
		});
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

	addDataFrom(path) {
		console.log(chalk.blue(path));
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
