import React from 'react';

export interface ValueViewerProps {
	value: string;
}

const ValueViewer: React.FC<ValueViewerProps> = (props: ValueViewerProps) => {
	return <span className="value-viewer">{props.value}</span>;
};

export default ValueViewer;
