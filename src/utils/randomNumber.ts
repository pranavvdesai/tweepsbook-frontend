export const randomNumber = (
	min: number,
	max: number,
	canBeDecinal?: boolean
) =>
	canBeDecinal
		? Math.random() * (max - min) + min
		: Math.floor(Math.random() * (max - min) + min)
