import { useOutsideClick } from 'hooks/use-outside-click';
import React, { useCallback, useEffect, useState } from 'react';
import { ENTER_KEY, ESCAPE_KEY } from 'types/keys';

type FunctionType = (...args: any[]) => any;

export interface DataEditorProps {
	value: string;
	onChange: FunctionType;
}

const DataEditor: React.FC<DataEditorProps> = (props: DataEditorProps) => {
	const [value, setValue] = useState(props.value);

	const handleOutSideClick = () => {
		console.log("handleOutSideClick");
		props.onChange(value);
	};

	const inputRef = useOutsideClick<HTMLInputElement>(handleOutSideClick, [
		handleOutSideClick,
	]);

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
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<input
			ref={inputRef}
			className="data-editor"
			value={value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	);
};

export default DataEditor;
