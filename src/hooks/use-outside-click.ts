import { useEffect, useRef } from 'react';

type CallbackFunctionType = () => void;

export const useOutsideClick = <T extends HTMLElement>(
	callback: CallbackFunctionType,
	dependencies?: React.DependencyList
) => {
	const ref = useRef<T>(null);

	let dependencyList: React.DependencyList = [];
	if (dependencies) {
		dependencyList = dependencies
	}

	useEffect(() => {
		console.log("rerender")
		const handleClick = (event: MouseEvent) => {
			console.log(event)
			if (ref.current && !ref.current.contains(event.target as Node)) {
				console.log("clicked outside current element");
				callback();
			} else {
				console.log("clicked on current element");
			}
		};

		console.log("adding click event")
		document.addEventListener("click", handleClick, true);

		return () => {
			console.log("removing click event")
			document.removeEventListener("click", handleClick, true);
		};
	}, [ref, ...dependencyList]);

	return ref;
};
