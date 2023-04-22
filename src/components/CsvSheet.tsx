import './react-datasheet.css';

import * as React from 'react';

import { CellShapeType } from './CellShape';
import DataSheet from './DataSheet';
import { ValueViewerProps } from './ValueViewer';

interface GridElement extends CellShapeType {
	value: number | null;
}

export type CsvSheetData = Array<Array<GridElement>>;

class CsvDataSheet extends DataSheet {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CsvSheetProps {
	data: CsvSheetData;
}

interface CsvSheetState {
	grid: CsvSheetData;
}

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
const cellRenderer: any = (props: any) => {
	const backgroundStyle =
		props.cell.value && props.cell.value < 0 ? { color: "red" } : undefined;

	return (
		<td
			style={backgroundStyle}
			onMouseDown={props.onMouseDown}
			onMouseOver={props.onMouseOver}
			onDoubleClick={props.onDoubleClick}
			className="cell"
		>
			{props.children}
		</td>
	);
};

export class CsvSheet extends React.Component<CsvSheetProps, CsvSheetState> {
	constructor(props: CsvSheetProps) {
		super(props);

		this.state = {
			grid: this.props.data,
		};

		// this.state = {
		// 	grid: [
		// 		[{ value: 1 }, { value: -3 }],
		// 		[{ value: -2 }, { value: 4 }],
		// 	],
		// };

		console.log(this.state);
	}
	render() {
		return (
            //TODO: Handle empty data
			<CsvDataSheet
				data={this.state.grid}
				valueRenderer={(cell) => {
					console.log("In valueRenderer");
					return cell.value;
				}}
				onCellsChanged={(changes) => {
					console.log("In onCellsChanged");
					const grid = this.state.grid.map((row) => [...row]);
					changes.forEach(({ row, col, value }: ValueViewerProps) => {
						grid[row][col] = { ...grid[row][col], value };
					});
					this.setState({ grid });
				}}
				cellRenderer={cellRenderer}
			/>
		);
	}
}
