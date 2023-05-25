import React, {
    createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef
} from 'react';
import { EVENT_EDIT_CELL_STARTED, EVENT_EDIT_FINISHED } from 'types/events';

export type EditingCellsType = {
	cellId: string | undefined;
	isEditing: boolean;
};

interface Props {
	children: ReactNode;
}

const EditableContext = createContext<EditingCellsType | undefined>(undefined);
const EditableDispatchContext = createContext<Dispatch<any> | undefined>(
	undefined
);

export const useEditable = () => {
	const context = useContext(EditableContext);
	if (context === undefined) {
		throw new Error(
			"useEditable() called without a <EditableProvider /> in the tree."
		);
	}

	return context;
};

export const useEditableDispatch = () => {
	const context = useContext(EditableDispatchContext);
	if (context === undefined) {
		throw new Error(
			"useEditableDispatch() called without a <EditableProvider /> in the tree."
		);
	}
	return context;
};

export default function EditableProvider({ children }: Props) {
	const [editable, dispatch] = useReducer(editableReducer, {
		cellId: undefined,
		isEditing: false,
	});
	const dgDom = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const handlePageClick = (e: MouseEvent) => {
			console.debug(e);
			if (!dgDom.current || !dgDom.current.contains(e.target as Node)) {
				if (editable.isEditing) {
					dispatch({ type: EVENT_EDIT_FINISHED });
				}
				document.removeEventListener("click", handlePageClick);
			}
		};

		// Keep listening to mouse if user releases the mouse (dragging outside)
		// Listen for any outside mouse clicks
		if (editable.isEditing) {
			document.addEventListener("click", handlePageClick);
		}

		return () => {
			document.removeEventListener("click", handlePageClick);
		};
	}, [editable, dgDom]);

	return (
		<EditableContext.Provider value={editable}>
			<EditableDispatchContext.Provider value={dispatch}>
				<span className="edit-container" ref={dgDom}>
					{children}
				</span>
			</EditableDispatchContext.Provider>
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
				isEditing: true,
			};
		}
		case EVENT_EDIT_FINISHED: {
			console.debug("Action EVENT_EDIT_FINISHED triggered");

			return {
				...prevState,
				cellId: undefined,
				isEditing: false,
			};
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
};
