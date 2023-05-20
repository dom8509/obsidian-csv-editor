import React from 'react';

import BodyRows from './BodyRows';
import HeaderRow from './HeaderRow';

const DataSheet = () => {
	return (
		<span
			// ref={(r) => {
			// 	if (r) {
			// 		this.dgDom = r;
			// 	}
			// }}
			// tabIndex={0}
			className="data-sheet-container"
			// onKeyDown={this.handleKey}
		>
			<table className="data-sheet">
				<tbody>
					{/* header row */}
					<HeaderRow />
					<BodyRows />
				</tbody>
			</table>
		</span>
	);
};

export default DataSheet;
