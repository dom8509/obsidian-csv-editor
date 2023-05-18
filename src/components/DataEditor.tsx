import React, { useEffect, useRef } from 'react';

type FunctionType = (...args: any[]) => any;

export interface DataEditorProps {
	value: string;
	onChange: FunctionType;
}

const DataEditor: React.FC<DataEditorProps> = (props: DataEditorProps) => {
	const input = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (input.current) {
			input.current.focus();
		}
	}, []);

	console.log("value: ", props.value)

	return (
		<input
			ref={input}
			className="data-editor"
			value={props.value}
			onChange={props.onChange}
		/>
	);
};

export default DataEditor;
