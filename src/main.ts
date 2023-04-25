import { Plugin } from 'obsidian';
import SampleSettingTab, { CsvTablePluginSettings } from 'settings';
import { CsvView, VIEW_TYPE_CSV } from 'views/CsvView';

const DEFAULT_SETTINGS: CsvTablePluginSettings = {
	mySetting: "default",
};

export default class CsvTablePlugin extends Plugin {
	settings: CsvTablePluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_CSV, (leaf) => new CsvView(leaf));
		this.registerExtensions(["csv"], VIEW_TYPE_CSV);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
