import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	fileList: [], // 上传文件列表 , uploadStatus 0或undefined 上传中   1 成功  2 失败
	deleteFileList: [],
};

const mutations = {
	CONTENT_CONFIG_MATERIAL_BANK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	CONTENT_CONFIG_MATERIAL_BANK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	CONTENT_CONFIG_MATERIAL_BANK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_CONFIG_MATERIAL_BANK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_CHANGE(state, file) {

		const index = state.fileList.findIndex(it => {
			return it.fileId == file.fileId;
		});

		if (index > -1) {
			state.fileList.splice(index, 1, { ...file });
		} else {
			const index2 = state.deleteFileList.findIndex(it => {
				return it.fileId == file.fileId;
			});
			if (index2 > -1) {
				state.deleteFileList.splice(index2, 1, { ...file });
			} else {
				state.fileList.push({ ...file });
			}
			
		}
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_SUCCESS(state, { fileId }) {
		const index = state.fileList.findIndex(file => file.fileId == fileId);
		if (index > -1) {
			state.fileList.splice(index, 1, { ...state.fileList[index], uploadStatus: 1 });
		} else {
			console.error('unkonw fileId ', fileId);
		}
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_ERROR(state, { fileId }) {

		const index = state.fileList.findIndex(file => file.fileId == fileId);
		if (index > -1) {
			state.fileList.splice(index, 1, { ...state.fileList[index], uploadStatus: 2 });
			
		} else {
			console.error('unkonw fileId ', fileId);
		}
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_DELETE(state, { fileId }) {
		const index = state.fileList.findIndex(file => file.fileId == fileId);
		if (index > -1) {
			state.deleteFileList.push(state.fileList[index]);
			state.fileList.splice(index, 1);
		} else {
			console.error('unkonw fileId ', fileId);
		}
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_DELETE_COMPLETE(state) {
		const completeFiles = state.fileList.filter(file => file.uploadStatus == 1);
		const unCompleteFiles = state.fileList.filter(file => file.uploadStatus != 1);
		state.deleteFileList = [...state.deleteFileList, ...completeFiles];
		state.fileList = unCompleteFiles;
	},
	CONTENT_CONFIG_MATERIAL_BANK_UPLOAD_DELETE_ALL(state) {
		state.deleteFileList = [...state.deleteFileList, ...state.fileList];
		state.fileList = [];
	}
};

export const contentConfigMaterialBank = {
	state: { ...initialState },
	mutations,
};
