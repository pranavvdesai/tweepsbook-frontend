export const extractBookmarkIdFromParam = (
	param: string,
	seperator: string
) => {
	const allSeperatedStrings = param.split(seperator)
	return allSeperatedStrings[allSeperatedStrings.length - 1]
}
