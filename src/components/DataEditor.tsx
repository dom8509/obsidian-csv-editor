import React, { useEffect, useRef, useState } from 'react';
import { ENTER_KEY, ESCAPE_KEY } from 'types/keys';

type FunctionType = (...args: any[]) => any;

export interface DataEditorProps {
	value: string;
	onChange: FunctionType;
}

const DataEditor: React.FC<DataEditorProps> = (props: DataEditorProps) => {
	const input = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState(props.value);

	const handleChange = (e: any) => {
		setValue(e.target.value);
	};

	const handleKeyDown = (e: any) => {
		const keyCode = e.key;
		if (keyCode === ENTER_KEY) {
			props.onChange(value);
		} else if (keyCode === ESCAPE_KEY) {
			props.onChange(props.value);
		}
	};

	useEffect(() => {
		if (input.current) {
			input.current.focus();
		}
	}, []);

	return (
		<input
			ref={input}
			className="data-editor"
			value={value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	);
};

export default DataEditor;
