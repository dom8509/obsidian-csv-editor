import { useEffect, useState } from 'react';

export interface ClickProps {
	event: MouseEvent | undefined;
	cellId: string | undefined;
	row: number | undefined;
	column: number | undefined;
}

interface ClickState {
	click: number;
	props: ClickProps;
}

type ClickCallback = (props: ClickProps) => void;

const initialState: ClickState = {
	click: 0,
	props: {
		event: undefined,
		cellId: undefined,
		row: undefined,
		column: undefined,
	},
};

export const useSingleAndDoubleClick = (
	actionSimpleClick: ClickCallback,
	actionDoubleClick: ClickCallback,
	delay = 250
) => {
	const [state, setState] = useState(initialState);

	useEffect(() => {
		console.debug("rerender");
		const timer = setTimeout(() => {
			// simple click
			if (state.click === 1) {
				console.debug("performing click");
				if (
					state.props.event === undefined ||
					state.props.cellId === undefined ||
					state.props.row === undefined ||
					state.props.column === undefined
				) {
					throw "Error: A property is undefined!";
				}
				actionSimpleClick(state.props);
			}
			setState(initialState);
		}, delay);

		// the duration between this click and the previous one
		// is less than the value of delay = double-click
		if (state.click === 2) {
			console.debug("performing doubleclick");
			if (
				state.props.event === undefined ||
				state.props.cellId === undefined ||
				state.props.row === undefined ||
				state.props.column === undefined
			) {
				throw "Error: A property is undefined!";
			}
			actionDoubleClick(state.props);
		}

		return () => clearTimeout(timer);
	}, [state.click]);

	return (
		event: MouseEvent,
		cellId: string,
		row: number,
		column: number
	) => {
		console.debug("here");
		event.stopPropagation();

		setState((prev) => ({
			click: prev.click + 1,
			props: {
				event: event,
				cellId: cellId,
				row: row,
				column: column,
			},
		}));
	};
};
