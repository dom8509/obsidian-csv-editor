
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { IObsidianCsvView } from 'types/obsidian';

interface PluginContextProps {
	plugin: IObsidianCsvView;
	children: ReactNode;
}

const PluginContext = createContext<IObsidianCsvView | undefined>(undefined);

export const usePlugin = (): IObsidianCsvView => {
	const context = useContext(PluginContext);
	if (context === undefined) {
		throw new Error(
			"usePlugin() called without a <PluginProvider /> in the tree."
		);
	}

	return context;
};

export default function PluginProvider({
	plugin,
	children,
}: PluginContextProps) {
	const [pluginState] = useState(plugin);

	return (
		<PluginContext.Provider value={pluginState}>
			<span className="plugin-container">{children}</span>
		</PluginContext.Provider>
	);
}
