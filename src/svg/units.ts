const BOTH_MATCH =
	/^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/;
const CONVERSIONS: { [k: string]: number } = {
	in: 96.0,
	pt: 1.3333333333333333,
	px: 1.0,
	mm: 3.779527559055118,
	cm: 37.79527559055118,
	m: 3779.527559055118,
	km: 3779527.559055118,
	Q: 0.94488188976378,
	pc: 16.0,
	yd: 3456.0,
	ft: 1152.0,
	"": 1.0,
};

export function userUnit(src: string, default_value?: number): number {
	if (src) {
		const m = src.match(BOTH_MATCH);
		if (m) {
			const value = parseFloat(m[1]);
			const unit = m.pop();
			if (unit) {
				const mul = CONVERSIONS[unit];
				if (mul) {
					return value * mul;
				}
			} else {
				return value;
			}
			throw new Error(`Can not convert to user unit ${src}, [${m}]`);
		} else {
			throw new Error(`Invalid unit ${src}`);
		}
	} else if (default_value !== undefined) {
		return default_value;
	}
	throw new Error(`Invalid unit ${src}`);
}
