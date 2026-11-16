import React from "react";
type UseCopyToClipboardReturn = [
	/**
	 * Writes the text to the clipboard (`navigator.clipboard.writeText`) and
	 * resolves to `true` when it got there, `false` when it didn't. Never
	 * rejects: a failure, or a browser without the Clipboard API, logs a
	 * warning. The same function on every render.
	 */
	copy: (text: string) => Promise<boolean>,
	/**
	 * `true` for 2 seconds after the last successful copy, then `false` again.
	 * A failed copy turns it off at once.
	 */
	isCopied: boolean,
];
/** How long `isCopied` stays `true` after a copy, in milliseconds. */
const COPIED_FOR = 2000;
/** Copies text to the clipboard and says, for a moment, that it did. */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
	// Counts the copies of the current moment, and goes back to 0 when it
	// ends: each copy is a new number, so the timer below starts over.
	const [copies, setCopies] = React.useState(0);
	// The timer lives with the component: unmounting (or hiding it in an
	// `<Activity>`) clears it, and showing it again starts it afresh.
	React.useEffect(() => {
		if (copies === 0) {
			return;
		}
		const timer = setTimeout(() => setCopies(0), COPIED_FOR);
		return () => clearTimeout(timer);
	}, [copies]);
	const copy = React.useCallback(async (text: string): Promise<boolean> => {
		if (typeof navigator === "undefined" || !navigator.clipboard) {
			console.warn("Clipboard not supported");
			return false;
		}
		try {
			await navigator.clipboard.writeText(text);
		} catch (error) {
			console.warn("Copy failed", error);
			setCopies(0);
			return false;
		}
		setCopies((count) => count + 1);
		return true;
	}, []);
	return [copy, copies > 0];
}
export type { UseCopyToClipboardReturn };
