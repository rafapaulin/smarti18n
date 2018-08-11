module.exports = {
	null: {
		definitions: [
			{ name: 'help', alias: 'h', type: Boolean, defaultValue: true },
			{ name: 'verbose', alias: 'v', type: Boolean, defaultValue: false }
		],
		usage: [{
			header: 'smarti18n',
			content: 'smarti18n cli provides commands for building per-component locale definitions into the default final assets json format'
		},{
			header: 'Usage',
			content: '$ smarti18n <command> <options>'
		},{
			header: 'Command List',
			content: [
				{ name: 'help', summary: 'Display help information' },
				{ name: 'build', summary: 'Builds all per-component locale definitions into default final assets json files' }
			]
		},{
			header: 'Options',
			optionList: [
				{ name: 'help', alias: 'h', description: 'Print this usage guide' },
				{ name: 'verbose', alias: 'v', description: 'Verbose output' }
			]
		}]
	},
	build: {
		definitions: [
			{ name: 'help', alias: 'h', type: Boolean, defaultValue: false },
			{ name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
			{ name: 'flat', type: Boolean, defaultValue: true },
			{ name: 'project', alias: 'p', type: String, defaultValue: undefined }
		],
		usage: [{
			header: 'smarti18n - build',
			content: 'builds all per-component locale definitions into final default assets files'
		},
		{
			header: 'Usage',
			content: '$ smarti18n build <options>'
		},{
			header: 'Options',
			optionList: [
				{ name: 'help', alias: 'h', description: 'Displays this usage guide.' },
				{ name: 'verbose', alias: 'v', description: 'Verbose output' },
				{ name: 'flat', description: 'Flat final product (disables lazy loading support)' },
				{ name: 'project', alias: 'p', description: 'Angular project to build' }
			]
		}]
	}
}
