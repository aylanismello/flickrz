export const desuckify = string => {
	const startIdx = string.indexOf("(") + 1;
	const endIdx = string.lastIndexOf(")");
	string = JSON.parse(string.slice(startIdx, endIdx));
	return string;
};

export const api_key = 'ccbc899ea575121dcb264e905bd536c4';
