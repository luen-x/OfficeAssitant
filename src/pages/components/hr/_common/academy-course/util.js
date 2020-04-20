import downloadFile from '@utils/download';

export const setData = (to, from) => {
	for (let key in to) {
		if (from[key] !== undefined) {
			to[key] = from[key];
		}
	}
};
export const findTreePath = (val, arr, path = []) => {
	for (let i = 0; i < arr.length; i++) {
		const _path = [...path];
		_path.push(arr[i].value);
		if (arr[i].value == val) {
			return _path;
		} else if (arr[i].children && arr[i].children.length) {
			const exist = findTreePath(val, arr[i].children, _path);
			if (exist) return exist;
		}
	}
};
export const downloadDirecotory = (arr) => {
	if (!Array.isArray(arr)) {
		arr = [arr];
	}
	arr.forEach(file => {
		if (file.children && file.attachment_type == 2) {
			downloadDirecotory(file.children);
		} else {
			downloadFile({ fileName: file.attachment_url });
		}
	});

};

const test = [
	{
		label: 'a',
		value: 1,
		children: [
			{
				label: 'a-2',
				value: 2
			},
			{
				label: 'a-3',
				value: 3
			},
			{
				label: 'a-4',
				value: 4,
				children: [
					{
						label: 'a-5',
						value: 5
					}
				]
			}

		],
		
	},
	{
		label: 'a',
		value: 11,
		children: [
			{
				label: 'a-2',
				value: 21
			},
			{
				label: 'a-3',
				value: 31
			},
			{
				label: 'a-4',
				value: 41,
				children: [
					{
						label: 'a-5',
						value: 51
					},
					{
						label: 'a-2',
						value: 22
					},
					{
						label: 'a-3',
						value: 32,
						children: [
							{
								label: 'a-5',
								value: 53,
								children: [
									{
										label: 'a-5',
										value: 54,
										children: [
											{
												label: 'a-5',
												value: 55
											}
										]
									}
								]
							},
							{
								label: 'a-5',
								value: 53,
								children: [
									{
										label: 'a-5',
										value: 54,
										children: [
											{
												label: 'a-5',
												value: 56
											}
										]
									}
								]
							}
						]
					},
					{
						label: 'a-4',
						value: 42,
						children: [
							{
								label: 'a-5',
								value: 52
							}
						]
					}
				]
			}

		],
		
	}
];
