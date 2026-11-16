export const formatDate = (date: string) => {
	const newDate = new Date(date);
	const userLocation = navigator.language;

	return newDate.toLocaleDateString(userLocation, {
		month: "numeric",
		day: "numeric",
		year: "numeric",
	});
};
