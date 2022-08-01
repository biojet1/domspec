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
	fr: 'fr',
};
// for(const [k, v] of Object.entries(units)){
// 	console.info(`static ${k} = (value: number) => new CSSUnitValue(value, '${v}');`)
// }

// for(const [k, v] of Object.entries(units)){
// 	console.info(`export const ${k} = (value: number) => new CSSUnitValue(value, '${v}');`)
// }

console.info(Object.values(units).join('|'));

const etc = {
	number: {
		number: 1,
	},
	percent: {
		percent: 1,
	},
	time: {
		s: 1,
		ms: 0.001,
	},
	length: {
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
	},
};

// CSSPrimitiveValue::UnitCategory CSSPrimitiveValue::UnitTypeToUnitCategory(
//     UnitType type) {
//   switch (type) {
//     case UnitType::kNumber:
//     case UnitType::kInteger:
//       return CSSPrimitiveValue::kUNumber;
//     case UnitType::kPercentage:
//       return CSSPrimitiveValue::kUPercent;
//     case UnitType::kPixels:
//     case UnitType::kCentimeters:
//     case UnitType::kMillimeters:
//     case UnitType::kQuarterMillimeters:
//     case UnitType::kInches:
//     case UnitType::kPoints:
//     case UnitType::kPicas:
//     case UnitType::kUserUnits:
//       return CSSPrimitiveValue::kULength;
//     case UnitType::kMilliseconds:
//     case UnitType::kSeconds:
//       return CSSPrimitiveValue::kUTime;
//     case UnitType::kDegrees:
//     case UnitType::kRadians:
//     case UnitType::kGradians:
//     case UnitType::kTurns:
//       return CSSPrimitiveValue::kUAngle;
//     case UnitType::kHertz:
//     case UnitType::kKilohertz:
//       return CSSPrimitiveValue::kUFrequency;
//     case UnitType::kDotsPerPixel:
//     case UnitType::kDotsPerInch:
//     case UnitType::kDotsPerCentimeter:
//       return CSSPrimitiveValue::kUResolution;
//     default:
//       return CSSPrimitiveValue::kUOther;
//   }
// }

// CSSPrimitiveValue::UnitType CSSPrimitiveValue::CanonicalUnitTypeForCategory(
//     UnitCategory category) {
//   // The canonical unit type is chosen according to the way
//   // CSSPropertyParser::ValidUnit() chooses the default unit in each category
//   // (based on unitflags).
//   switch (category) {
//     case kUNumber:
//       return UnitType::kNumber;
//     case kULength:
//       return UnitType::kPixels;
//     case kUPercent:
//       return UnitType::kUnknown;  // Cannot convert between numbers and percent.
//     case kUTime:
//       return UnitType::kSeconds;
//     case kUAngle:
//       return UnitType::kDegrees;
//     case kUFrequency:
//       return UnitType::kHertz;
//     case kUResolution:
//       return UnitType::kDotsPerPixel;
//     default:
//       return UnitType::kUnknown;
//   }
// }
