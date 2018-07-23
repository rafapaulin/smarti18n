const clicommands = require('command-line-commands');
const cliargs = require('command-line-args');
const cliusage = require('command-line-usage');
const commandLineConfig = require('./config');
const CommandBuild = require('./commandBuild');

module.exports = class Smarti18nCommandLineInterface {
	run() {
		this.parseCommandAndArgs();
		// run commands
		if (this.options.help)
			console.log(this.printCommandUsage());
		else {
			switch(this.command) {
				case 'build':
					this.commandHandler = new CommandBuild(this.options);
					break;
			}
			if (this.commandHandler)
				this.commandHandler.run();
		}
	}

	parseCommand() {
		const { command, argv } = clicommands(Object.keys(commandLineConfig).map(k => k === 'null' ? null : k));
		this.command = command;
		this.argv = argv;
	}
	parseCommandAndArgs() {
		this.parseCommand();
		this.options = cliargs(commandLineConfig[this.command].definitions, { argv: this.argv });
	}
	printCommandUsage() {
		console.log(cliusage(commandLineConfig[this.command].usage));
	}
}
