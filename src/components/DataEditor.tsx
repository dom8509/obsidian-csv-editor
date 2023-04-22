import React from 'react';

import { CellShapeType } from './CellShape';

type FunctionType = (...args: any[]) => any;

export interface DataEditorProps {
	value: any;
	row: number;
	col: number;
	cell: CellShapeType;
	onChange: FunctionType;
	onCommit: FunctionType;
	onRevert: FunctionType;
	onKeyDown: FunctionType;
}

export interface DataEditorState {
	_input: FunctionType;
}

export default class DataEditor extends React.Component<
	DataEditorProps,
	DataEditorState
> {
	private _input: any;

	constructor(props: DataEditorProps) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this._input.focus();
	}

	handleChange(e) {
		this.props.onChange(e.target.value);
	}

	render() {
		const { value, onKeyDown } = this.props;
		return (
			<input
				ref={(input) => {
					this._input = input;
				}}
				className="data-editor"
				value={value}
				onChange={this.handleChange}
				onKeyDown={onKeyDown}
			/>
		);
	}
}
