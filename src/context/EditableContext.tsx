import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { EVENT_EDIT_CELL_FINISHED, EVENT_EDIT_CELL_STARTED } from 'types/events';

export type EditingCellsType = {
	cellId: string | undefined;
};

interface EditableContextProps {
	children: ReactNode;
}

type ContextType = {
	editable: EditingCellsType;
	dispatch: Dispatch<any>;
};

const EditableContext = createContext<ContextType | undefined>(undefined);

export const useEditable = (): [
	EditingCellsType,
	React.Dispatch<any>,
] => {
	const context = useContext(EditableContext);
	if (context === undefined) {
		throw new Error(
			"useEditable() called without a <EditableProvider /> in the tree."
		);
	}

	return [context.editable, context.dispatch];
};

export default function EditableProvider({
	children,
}: EditableContextProps) {
	const [editable, dispatch] = useReducer(editableReducer, {
		cellId: undefined,
	});
	
	return (
		<EditableContext.Provider value={{ editable, dispatch }}>
			<span className="edit-container">
				{children}
			</span>
		</EditableContext.Provider>
	);
}

const editableReducer = (
	prevState: EditingCellsType,
	action: any
): EditingCellsType => {
	switch (action.type) {
		case EVENT_EDIT_CELL_STARTED: {
			console.debug("Action EVENT_EDIT_CELL_STARTED triggered");

			return {
				...prevState,
				cellId: action.payload.cellId,
			};
		}
		case EVENT_EDIT_CELL_FINISHED: {
			console.debug("Action EVENT_EDIT_CELL_FINISHED triggered");

			return {
				...prevState,
				cellId: undefined,
			};
		}
		default: {
			console.log("Unknown action: " + action.type);
			return prevState;
		}
	}
};
