import React from "react";

/**
 * formatDayTime - helper to format a Date/string/number into dd-mm-yyyy
 * options: { showTime: boolean } to include HH:MM:SS
 */
export function formatDayTime(value, { showTime = false } = {}) {
	if (value === null || value === undefined || value === "") return null;

	let d;
	if (value instanceof Date) d = value;
	else {
		// support timestamp or date string
		d = new Date(value);
	}

	if (Number.isNaN(d.getTime())) return null;

	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();

	if (showTime) {
		const hh = String(d.getHours()).padStart(2, "0");
		const min = String(d.getMinutes()).padStart(2, "0");
		const ss = String(d.getSeconds()).padStart(2, "0");
		return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
	}

	return `${dd}-${mm}-${yyyy}`;
}

/**
 * DayTimeFormat React component
 * Props:
 * - `value`: Date | string | number
 * - `showTime`: boolean (optional) - include time when true
 * - `placeholder`: string shown when value is empty/invalid (default: "-")
 */
const DayTimeFormat = ({ value, showTime = false, placeholder = "-" }) => {
	const formatted = formatDayTime(value, { showTime });
	return <>{formatted || placeholder}</>;
};

export default DayTimeFormat;
