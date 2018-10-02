const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

module.exports = class BuildCommand {
	/**
	 *Creates an instance of BuildCommand.
	 * @param {*} options
	 */
	constructor(options) {
		this.options = options;
		this.verbose = this.options.verbose
			? (...args) => console.log(chalk.gray(args))
			: () => {}
		this.locales = {};
	}

	/**
	 *
	 *
	 */
	run() {
		this.verboseCommandInfo();
		const projectSrcPath = this.getSrcPath(this.options.project);
		this.build(projectSrcPath);
		this.saveLocales(projectSrcPath);
	}


	/**
	 *
	 *
	 * @param {*} buildPath
	 */
	build(buildPath) {
		this.verbose(`- ${buildPath}`);
		const list = fs.readdirSync(buildPath);
		const sep = this.separateFolders(buildPath, list);
		sep.folders.forEach(folder => this.build(folder));
		if (sep.i18n)
			this.addDataFromDir(sep.i18n);
	}

	/**
	 *
	 *
	 * @param {*} basePath
	 * @param {*} list
	 * @returns
	 */
	separateFolders(basePath, list) {
		const i18nPath = path.join(basePath, 'i18n');
		return {
			folders: list
				.map(entry => path.join(basePath, entry))
				.filter(fullPath =>
					fs.existsSync(fullPath)
					&& !fullPath.endsWith('i18n')
					&& !fullPath.endsWith('assets')
					&& fs.lstatSync(fullPath).isDirectory()),
			i18n: fs.existsSync(i18nPath) ? i18nPath : undefined
		};
	}

	/**
	 *
	 *
	 * @param {*} i18nPath
	 */
	addDataFromDir(i18nPath) {
		const configRegex = /^config\.i18n\.json/
		const i18nRegex = /(.*)\.i18n\.json/i;
		const list = fs.readdirSync(i18nPath);

		this.verbose(`- ${i18nPath}`);

		list.filter(f => !configRegex.test(f))
			.map(f => ({
				locale: i18nRegex.exec(f)[1],
				filePath: path.join(i18nPath, f),
				config: path.join(i18nPath, 'config.i18n.json')
			}))
			.forEach(({locale, filePath, config}) => {this.addDataFromFile(locale, filePath, config)});
	}
	/**
	 *
	 *
	 * @param {*} locale
	 * @param {*} filePath
	 */
	addDataFromFile(locale, filePath, config) {
		const hasConfig = fs.existsSync(config);

		this.verbose(`    - ${filePath}`);

		if (!this.locales[locale])
			this.locales[locale] = {};

		this.writeDataToGraph(
			this.locales[locale],
			filePath,
			hasConfig ? config : null
		);
	}

	/**
	 *
	 *
	 * @param {*} writeData
	 * @param {*} readData
	 */
	writeDataToGraph(writeData, filePath, config) {
		const readData = require(filePath);
		let basePath;

		config = config ? require(config) : {};

		config.loadMode = config.loadMode ? config.loadMode : 'eager';

		switch (config.loadMode) {
			case 'eager':
				if (!config.basePath) {
					console.log(chalk.yellow('warning: no basePath set to eager loaded file. Translation keys may be overwritten!'));
					console.log(chalk.grey(filePath));
					console.log();

					basePath = 'base';
				} else
					basePath = `base.${config.basePath}`;
				break;
			case 'lazy':
				if (!config.basePath) {
					console.log(chalk.red('error: lazy load mode requires \'basePath\' to be set!'));
					console.log(chalk.grey(filePath));
					console.log();

					throw new Error('lazy load mode requires "basePath" to be set!');
				} else
				basePath = config.basePath;
				break;
		}

		writeData = this.parseDotNotation(basePath, writeData);

		// write the rest
		Object.keys(readData).forEach(k => {
			const translation = basePath.split('.').reduce((a, b) => a[b], writeData);

			translation[k] = readData[k];
		});
	}

	/**
	 *
	 *
	 * @param {*} saveBasePath
	 */
	saveLocales(saveBasePath) {
		Object.keys(this.locales).forEach(locale => {
			const obj = this.locales[locale];
			Object.keys(obj).forEach(key => {
				const finalPath = path.join(saveBasePath, 'assets', 'i18n', locale, `${key}.i18n.json`);
				fs.outputJsonSync(finalPath, obj[key]);

				console.log(chalk.green(`${finalPath} written successfully`));
			});
		});
	}

	/**
	 *
	 *
	 * @param {*} [project=undefined]
	 * @returns
	 */
	getSrcPath(project = undefined) {
		const angularConfigPath = path.join(process.cwd(), 'angular.json');
		if (!fs.existsSync(angularConfigPath)) {
			console.log(chalk.red('error: Angular config not found!'));
			throw new Error('Angular config not found');
		}

		const angularConfig = require(angularConfigPath);
		project = project || angularConfig.defaultProject;
		this.verbose(chalk.gray(`building project ${project}...`));
		if (!angularConfig.projects[project]) {
			console.log(chalk.red('error: Invalid project!'));
			throw new Error('Invalid project');
		}
		else return path.join(process.cwd(), angularConfig.projects[project].sourceRoot);
	}

	parseDotNotation(str, obj) {
		const keys = str.split(".");
		let currentObj = obj;

		for (let i in keys) {
			const key = keys[i];
			currentObj[key] = currentObj[key] || {};
			currentObj = currentObj[key];
		}

		return obj;
	}

	/**
	 *
	 *
	 */
	verboseCommandInfo() {
		if (this.options.verbose) {
			this.verbose(`running 'build' command with options:`);
			Object.keys(this.options).forEach(optKey => this.verbose(`    ${optKey}: ${this.options[optKey]}`));
		}
	}
}
