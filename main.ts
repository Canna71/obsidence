import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// import * as markdown2confluence from 'markdown2confluence';
// import  * as markdown2confluence from 'masrkdown2confluence';
// Remember to rename these classes and interfaces!
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdown2confluence = require('markdown2confluence');
interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("Confluence Plugin Loaded");

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('documents', 'Copy to Confluence', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// new Notice('Hello, world!');
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			this.copyMarkdown(view);
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('confluence-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'copy-to-confluence',
		// 	name: 'Copy to Confluence/Jira',
		// 	callback: () => {
		// 		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		this.copyMarkdown(view);
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'copy-to-confluence',
			name: 'Copy to Confluence/Jira',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// console.log(editor.getSelection());
				this.copyMarkdown(view);
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private copyMarkdown(view: MarkdownView | null) {
		if (view) {
			// const view_mode = view.getMode(); // "preview" or "source" (can also be "live" but I don't know when that happens)
			// console.log(view_mode);
			const content = view.getViewData(); //.sourceMode.cmEditor.getDoc().getValue();
			// console.log(content);
			if (content) {
				const converted = markdown2confluence(content);
				navigator.clipboard.writeText(converted);
				new Notice('Content was converted and copied to clipboard.');
			}
		}
	}


	onunload() {
		console.log("Confluence Plugin unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
