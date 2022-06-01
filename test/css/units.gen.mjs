const units = {
	number: '',
	percent: '%',
	em: 'em',
	ex: 'ex',
	ch: 'ch',
	rem: 'rem',
	vw: 'vw',
	vh: 'vh',
	vmin: 'vmin',
	vmax: 'vmax',
	cm: 'cm',
	mm: 'mm',
	in: 'in',
	pt: 'pt',
	pc: 'pc',
	px: 'px',
	Q: 'Q',
	deg: 'deg',
	grad: 'grad',
	rad: 'rad',
	turn: 'turn',
	s: 's',
	ms: 'ms',
	Hz: 'Hz',
	kHz: 'kHz',
	dpi: 'dpi',
	dpcm: 'dpcm',
	dppx: 'dppx',
	fr: 'fr'
};
// for(const [k, v] of Object.entries(units)){
// 	console.info(`static ${k} = (value: number) => new CSSUnitValue(value, '${v}');`)
// }

// for(const [k, v] of Object.entries(units)){
// 	console.info(`export const ${k} = (value: number) => new CSSUnitValue(value, '${v}');`)
// }

console.info(Object.values(units).join('|'));