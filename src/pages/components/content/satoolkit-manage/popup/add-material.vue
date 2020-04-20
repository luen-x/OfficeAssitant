<template>
	<i-modal
		ref="modal"
		:loading="true"
		:mask-closable="false"
		v-model="visible"
		title="文件信息"
		width="680"
		class-name="v-content-satoolkit-manage-modal-small"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="margin-left: 143px;">
			<i-form class="_input-wrapper">
				<i-form-item>
					<div style="width:300px">
						<i class="iconfont icon-pdf" style="font-size: 18px;"/>
						<span
							v-if="fileInfoNew.length > 0"
							style="font-size: 14px;"
						>{{ fileInfoNew[0].title }}等{{ fileInfoNew.length }}个文件</span>
					</div>
				</i-form-item>
				<i-form-item>
					<i-poptip :offset="-35" v-model="visibleAddress" placement="bottom">
						<div>
							<i-input
								v-model="uploadUrl"
								style="width:300px"
								disabled
								class="_url-box"
								placeholder="上传地址"
							/>
							<i-button
								slot="append"
								style="margin-left: 10px;"
								type="primary"
								@click="showTree"
							>修改</i-button>
						</div>
						<div slot="content" class="_poptip-content">
							<i-tree
								ref="tree"
								:data="classListData"
								@on-select-change="getCheckedAndIndeterminateNodes"
							/>
						</div>
					</i-poptip>
				</i-form-item>
				<i-form-item label="关联副类目:">
					<i-poptip
						v-model="visibleList"
						placement="bottom"
						style="width:300px"
						@on-popper-show="poptipShow = true"
						@on-popper-hide="poptipShow = false"
					>
						<div class="_select-class _select-width">
							<i-input v-show="false"/>
							<span v-if="classListArray.length === 0">请选择</span>
							<div v-for="(item, index) in classListArray" :key="index" class="_tag">
								<span>{{ item.title }}</span>
								<i
									class="ivu-icon ivu-icon-ios-close"
									@click.stop="closeClassList(index)"
								/>
							</div>
							<i
								:class="poptipShow ? 'icon-up' : 'icon-down'"
								class="iconfont icon-down"
								style="float: right;font-size: 12px"
							/>
						</div>
						<div slot="content" style="width:300px" class="_poptip-content">
							<i-tree
								ref="classTree"
								:data="classListData2"
								@on-select-change="getCheckedClassNode"
							/>
						</div>
					</i-poptip>
				</i-form-item>
				<i-form-item label="服务项关联:">
					<i-select v-model="serviceValue" style="width:300px" class="_select-width">
						<i-option
							v-for="item in serviceList"
							:key="item.id"
							:value="item.id"
						>{{ item.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="fileInfoNew.length === 1" label="排序权重值:">
					<i-input v-model="sortValue" placeholder="请输入数值" style="width: 80px;"/>
					<span>（数值越高，资料排名越靠前）</span>
				</i-form-item>
				<i-form-item label="查看权限:" class="_m-left">
					<i-select
						v-model="roleListArray"
						multiple
						class="_select-width"
						style="width:300px"
						@on-change="handleRoleListArray"
					>
						<i-option
							v-for="item in roleList"
							:key="item.role_id"
							:value="item.role_id"
						>{{ item.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="消息通知:" class="_m-left">
					<i-select
						v-model="informArray"
						multiple
						class="_select-width"
						style="width:300px"
					>
						<i-option
							v-for="item in roleList"
							:key="item.role_id"
							:value="item.role_id"
						>{{ item.role_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="fileInfo" label="通知内容:" style="display: flex;" class="_m-left">
					<oa-limit-words
						v-model="notice_content"
						:placeholder="'请填写通知内容'"
						:max="500"
						class="_select-width"
						style="width: 300px"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Button, Tree, Form, FormItem, Input, Icon, Select, Option, Poptip } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl } from '@utils/utils';

export default {
	name: 'oa-add-material',
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-tree': Tree,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-poptip': Poptip,
	},
	props: {
		data: Object
	},
	data() {
		return {
			visibleAddress: false,
			visibleList: false,
			visible: false,
			isShowTree: false,
			poptipShow: false,
			isFirstGetData: true,
			uploadUrl: '',
			notice_content: '',
			classListData: [],
			classListData2: [],
			classListArray: [],
			roleListArray: [],
			serviceValue: '',
			informArray: [],
			roleListArray2: [],
			informArray2: [],
			serviceList: [],
			sortValue: '1',
			categoryIdMain: '',
			categoryIdChild: [],
			categoryName: '',
			roleList: [],
			fileInfoNew: [],
			formData: {

			}
		};
	},
	computed: {
		fileInfo() {
			return this.$options.propsData.fileInfo;
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.handleClassList();
		this.visible = true;
		this.handleServiceList();
		if (this.fileInfo) {
			this.fileInfoNew = this.fileInfo;
		} else {
			let fileInfoObj = {
				title: this.data.material_name,
				url: this.data.file_url,
				size: this.data.file_size,
			};
			let relation = {
				title: this.data.relation_list,
				category_id: this.data.relation_id_list
			};
			this.roleListArray2 = this.data.show_role_id_list;
			this.informArray2 = this.data.notice_role_id_list;
			this.roleListArray = this.data.show_role_id_list;
			this.informArray = this.data.notice_role_id_list;
			this.handleInfoRoll();
			this.fileInfoNew.push(fileInfoObj);
			this.handleRollList(this.data.category_id, '1');
			if (relation.title) {
				this.classListArray.push(relation);
			}
			this.uploadUrl = '/' + this.data.category_name;
			this.categoryIdMain = this.data.category_id;
			this.serviceValue = this.data.relation_service_id;
			this.categoryIdChild.push(this.data.relation_id_list);
			this.sortValue = this.data.sort_value;
		}
	},
	methods: {
		handleClassList() {
			this.$request({
				url: API_ROOT._CONTENT_CATEGORY_LIST_GET,
				type: 'GET',
				param: {
					kit_type: 2,
					is_control_role: 0
				},
			}).then((res) => {
				let listString = '';
				let classList = [];
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				classList = JSON.parse(listString);
				this.classListData = JSON.parse(JSON.stringify(classList));
				this.classListData2 = JSON.parse(JSON.stringify(classList));
				this.handleExpand(this.classListData2);
				this.$refs.classTree.stateTree = this.classListData2;
				if (this.fileInfo) {
					let categoryId = Number;
					let isHaveid = getParseUrl().query;
					if (!isHaveid.category_id) {
						categoryId = this.classListData[0].category_id;
					} else {
						categoryId = getParseUrl().query.category_id;
					}
					this.categoryIdMain = categoryId;
					this.handleRollList(this.categoryIdMain);
					this.$request({
						url: API_ROOT._CONTENT_CATEGORY_DETAIL_GET,
						type: 'GET',
						param: {
							category_id: categoryId,
							is_control_role: 0
						}
					}).then((arr) => {
						this.uploadUrl = '/' + arr.data.category_name;
						this.categoryName = arr.data.category_name;
						this.handleDisabled(true);
						this.$refs.classTree.stateTree = this.classListData2;
					});
				} else {
					this.categoryName = this.data.category_name;
					this.handleDisabled(true);
					this.$refs.classTree.stateTree = this.classListData2;
				}
			});
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			let materialList = {};
			let param = {
				material_id: this.fileInfo ? '' : this.data.material_id,
				category_id: +this.categoryIdMain,
				relation_category: this.categoryIdChild,
				notice_content: this.notice_content,
				material_list: [],
				role_show: this.roleListArray,
				role_notice: this.informArray,
			};
			if (this.fileInfo) {
				for (let i in this.fileInfo) {
					materialList = {
						kit_type: 2,
						material_name: this.fileInfo[i].title,
						file_url: this.fileInfo[i].url,
						file_size: this.fileInfo[i].size.toString(),
						sort_value: this.sortValue,
						file_type: this.fileInfo[i].type,
						relation_service_id: this.serviceValue
					};
					param.material_list.push(materialList);
				}
			} else {
				materialList = {
					kit_type: 2,
					material_name: this.data.material_name,
					file_url: this.data.file_url,
					file_size: this.data.file_size,
					sort_value: this.sortValue,
					file_type: this.data.file_type,
					relation_service_id: this.serviceValue
				};
				param.material_list.push(materialList);
			}
			this.$request({
				url: API_ROOT._CONTENT_SERVICE_CREATE_AND_EDIT_POST,
				type: 'POST',
				param
			}).then(() => {
				if (this.fileInfo) {
					this.$Message.success('添加成功');
				} else {
					this.$Message.success('修改成功');
				}
				this.$store.commit('CONTENT_SATOOLKIT_MANAGE_LIST_INIT');
				this.$emit('sure');
			}).catch((error) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		showTree() {
			this.isShowTree = !this.isShowTree;
		},
		getCheckedAndIndeterminateNodes() {
			let treeArray = this.$refs.tree.getSelectedNodes();
			this.uploadUrl = '';
			this.handleDisabled(false);
			this.$refs.classTree.stateTree = this.classListData2;
			for (let i in treeArray) {
				this.uploadUrl += '/' + treeArray[i].title;
				this.categoryName = treeArray[i].title;
				this.handleDisabled(true);
				this.$refs.classTree.stateTree = this.classListData2;
			}
			if (treeArray[treeArray.length - 1]) {
				this.categoryIdMain = treeArray[treeArray.length - 1].category_id;
				this.handleRollList(treeArray[treeArray.length - 1].category_id);
			} else {
				this.categoryIdMain = '';
			}
			this.isShowTree = false;
			this.visibleAddress = false;
			this.$forceUpdate();
		},
		handleRollList(categoryId, editFirst) {
			this.$request({
				url: API_ROOT._CONTENT_MATERIAL_ROLE_LIST_GET,
				type: 'GET',
				param: {
					category_id: categoryId
				}
			}).then((res) => {
				this.roleList = res.data;
				if (!editFirst) {
					this.roleListArray = [];
					this.informArray = [];
					for (let i in this.roleList) {
						this.roleListArray.push(this.roleList[i].role_id);
						this.informArray.push(this.roleList[i].role_id);
					}
				}
			});
		},
		getCheckedClassNode() {
			let treeArray = this.$refs.classTree.getSelectedNodes();
			this.categoryIdChild = [];
			for (let i in treeArray) {
				this.categoryIdChild.push(treeArray[i].category_id);
			}
			this.classListArray = treeArray;
			this.visibleList = false;
		},
		handleServiceList() {
			this.$request({
				url: API_ROOT._CONTENT_SERVICE_LIST_GET,
				type: 'GET'
			}).then((res) => {
				this.serviceList = res.data;
			});
		},
		handleDisabled(isDisable) {
			let objClass = {};
			for (let i in this.classListData2) {
				objClass = this.handleClassNode(this.categoryName, this.classListData2[i]);
				if (objClass && objClass !== '') {
					if (isDisable) {
						objClass.disabled = true;
						objClass.expand = true;
					} else {
						objClass.disabled = false;
						objClass.expand = false;
					}
					this.$forceUpdate();
					return false;
				}
			}
		},
		handleClassNode(name, data) {
			if (name == data.title) {
				return data;
			}
			if (data.children && data.children.length > 0) {
				const categorys = data.children;
				for (let i = 0; i < categorys.length; i++) {
					const it = this.handleClassNode(name, categorys[i]);
					if (it) {
						return it;
					}
				}
			}
		},
		handleExpand() {
			for (let i in this.classListData2) {
				this.handleData(this.classListData2[i]);
			}
		},
		handleData(data) {
			data.expand = true;
			if (data.children && data.children.length > 0) {
				const categorys = data.children;
				for (let i = 0; i < categorys.length; i++) {
					this.handleData(categorys[i]);
				}
			}
		},
		closeClassList(index) {
			let treeNode = this.$refs.classTree.flatState;
			for (let i in treeNode) {
				if (treeNode[i].node.title === this.classListArray[0].title) {
					this.$refs.classTree.flatState[i].node.selected = false;
				}
			}
			this.visibleList = false;
			this.classListArray.splice(index, 1);
		},
		handleRoleListArray(res) {
			if (this.isFirstGetData) {
				this.isFirstGetData = false;
			} else if (res.length > this.roleListArray2.length) {
				this.informArray.push(res[res.length - 1]);
			} else if (res.length < this.roleListArray2.length) {
				let arry = [];
				let tmp = this.roleListArray.concat(this.roleListArray2);
				let obj = {};
				for (let i = 0; i < tmp.length; i++) {
					(tmp[i] in obj) ? obj[tmp[i]]++ : obj[tmp[i]] = 1;
				}
				for (let x in obj) {
					if (obj[x] == 1) arry.push(x);
				}
				for (let i in this.informArray) {
					if (this.informArray[i] === arry[0]) {
						this.informArray.splice(i, 1);
					}
				}
			}
			this.informArray2 = this.informArray;
			this.roleListArray2 = this.roleListArray;
			this.handleInfoRoll();
		},
		handleInfoRoll() {
			this.roleList2 = [];
			for (let i in this.roleListArray) {
				for (let j in this.roleList) {
					if (this.roleListArray[i] === this.roleList[j].role_id) {
						this.roleList2.push(this.roleList[j]);
					}
				}
			}
		}
	}
};
export const AddMaterial = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" soped>
    .v-content-satoolkit-manage-modal-small {
        .btn-red {
            background: #e74854;
            color: #fff !important;
        }
        ._input-wrapper {
            /deep/ .ivu-input[disabled] {
                background-color: #fff !important;
                color: #515a6e !important;
                cursor: pointer !important;
            }
            ._url-box {
                width: 365px;
            }
            .ivu-btn-primary {
                color: #fff;
            }
            ._m-left {
                margin-left: 11px;
            }
            ._select-width {
                width: 300px;
            }
            // ._tree-box{
            // 	position: absolute;
            // 	position: absolute;
            // 	top: 36px;
            // 	width: 435px;
            // 	padding: 0 20px;
            // 	box-sizing: border-box;
            // 	z-index: 10;
            // 	background: #fff;
            // 	height: 275px;
            // 	overflow-y: auto;
            // 	border-radius: 4px;
            // 	box-shadow:0px 2px 20px 0px rgba(223,223,223,1);
            // }
            ._select-class {
                display: inline-block;
                box-sizing: border-box;
                vertical-align: middle;
                color: #515a6e;
                font-size: 12px;
                line-height: 32px;
                outline: 0;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                position: relative;
                padding: 0 10px 0 4px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #dcdee2;
                transition: all 0.2s ease-in-out;
                ._tag {
                    height: 24px;
                    line-height: 22px;
                    margin: 0 4px 3px 0;
                    display: inline-block;
                    padding: 0 8px;
                    border: 1px solid #e8eaec;
                    border-radius: 3px;
                    background: #f7f7f7;
                    font-size: 12px;
                    vertical-align: middle;
                    opacity: 1;
                    overflow: hidden;
                    cursor: pointer;
                }
            }
        }
        ._poptip-content {
            width: 330px;
            height: 200px;
            overflow-y: hidden;
            &:hover {
                overflow-y: auto;
            }
        }
        ul {
            font-size: 14px !important;
        }
        .__menu-hover:hover {
            background: #eff5fc;
        }
        .__menu-active {
            background: #818895;
            color: #fff;
        }
        .ivu-icon-ios-arrow-forward {
            font-family: "iconfont" !important;
            font-size: 15px !important;
        }
        .ivu-icon-ios-arrow-forward:before {
            content: "\eb97" !important;
        }
        .ivu-tree-arrow {
            position: relative;
            margin-right: 5px;
            z-index: 0;
            padding-left: 14px;
            color: #e74854;
            i {
                font-size: 25px;
            }
        }

        .ivu-tree-title {
            vertical-align: middle;
        }
        .ivu-tree-empty {
            text-align: center;
        }
    }
</style>
