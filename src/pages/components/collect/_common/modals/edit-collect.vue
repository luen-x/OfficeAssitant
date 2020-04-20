<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="编辑收藏夹"
		class="v-collect-main-edit-collect"
		width="680"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<!-- <div v-if="!loading && formData.list.length==0" class="g-tc" style="margin-top: 60px;">
				<img :src="OSS_NO_MESSAGE02" style="width:120px" >
				<div>你还没有收藏夹，<span class="g-operation" @click="handleAdd">点击新增一个收藏夹吧～</span></div>
			</div> -->
			<vc-sort-list
				v-model="formData.list"
				:mask="false"
				:draggable="false"
				value-key="key"
			>
				<template slot-scope="option">
					<i-form-item 
						:key="option.key" 
						:label="' '"
						:prop="'list.' + (option.sortIndex || 0) + '.category_name'"
						:rules="rules.category_name" 
					>	
						<div class="g-bg-gray-mid _gray-bg g-dp-ib g-pd-10" style="width:520px" >
							<i-input 
								v-model="formData.list[option.sortIndex||0].category_name" 
								:maxlength="10"
								:placeholder="formData.list.length==1?'请输入类目名称':('类目名称'+(option.sortIndex+1))"
								style="width:300px;top: -2px;"
							/>
							<span class="g-c-black3 g-m-l-10 g-m-r-5">{{ option.count || 0 }}条内容</span>
							<span v-if="option.sortIndex !==0" class="g-operation g-m-l-20" @click="handleMoveUp(option.sortIndex)">上移</span>
							<span 
								v-if="option.sortIndex !==formData.list.length-1" 
								class="g-operation g-m-l-20" 
								@click="handleMoveDown(option.sortIndex)"
							>
								下移
							</span>
						</div>
						<span>
							<i
								class="icon iconfont icon-remove-circle g-m-l-10 g-c-red-mid g-pointer"
								style="position: relative;top: 3px;"
								@click="handleDelete(option)"
							/>
							<i
								v-if="option.sortIndex==formData.list.length-1"
								class="icon iconfont icon-add1 g-c-blue-mid g-m-l-10 g-pointer"
								style="position: relative;top: 3px;"
								@click="handleAdd(option)"
							/>
						</span>
						
					</i-form-item>
				</template>
			</vc-sort-list>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal, SortList } from 'wya-vc';
import { dataValidity, objRegex, uid } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm.vue';
import { OSS_NO_MESSAGE02 } from '@constants/constants';


export default {
	name: "oa-collect-edit",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		"vc-sort-list": SortList
	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			OSS_NO_MESSAGE02,
			visible: false,
			formData: {
				list: [
					{ category_name: '', category_id: "", is_delete: 0, key: uid() }
					
				]
			},
			deleteList: [],
			rules: {
				category_name: [{ required: true, type: 'string', message: "请输入类目名称", trigger: "blur" }]
			},
			loading: true

		};
	},
	// computed: {
	// 	listShow() {
	// 		return this.formData.list.filter(i => i.is_delete == 0);
	// 	}

	// },
	created() {
		this.loadCollectCategory();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadCollectCategory() {
			this.$request({
				url: "_COLLECT_MAIN_COLLECT_CATEGORY_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				if (!res.data.list.length) return;
				this.formData.list = res.data.list.map(({ category_name, category_id, count }) => {
					return { category_name, category_id, count, is_delete: 0, key: uid() };
				});
			}).catch((res) => {

				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});
		},
		handleAdd() {
			this.formData.list.push({ category_name: '', category_id: "", is_delete: 0, key: uid() });
		},
		handleMoveUp(index) {
			const item = this.formData.list.splice(index, 1);
			this.formData.list.splice(index - 1, 0, item[0]);
		},
		handleMoveDown(index) {
			const item = this.formData.list.splice(index, 1);
			this.formData.list.splice(index + 1, 0, item[0]);
		},
		handleDelete(item) {
			
			if (item.count) {
				Confirm.popup({
					title: '提示',
					msg: '此收藏夹中存在素材不能删除'
			
				}).catch();
				return;
			}
			if (item.category_id) {
				this.formData.list.splice(item.sortIndex, 1);
				item.is_delete = 1;
				this.deleteList.push(item);
			} else this.formData.list.splice(item.sortIndex, 1);
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					const sameNameItem = this.formData.list.find((i, index1) => this.formData.list.find(
						(j, index2) => index1 < index2 && i.category_name === j.category_name
					));
					if (sameNameItem && sameNameItem.category_name) {
						this.$Message.warning('收藏夹名称"' + sameNameItem.category_name + '"重复,请修改');
						this.$refs.modal.buttonLoading = false;
						return;
					}
					const param = [
						...this.deleteList.map(({ category_name, category_id }) => ({ category_name, category_id, is_delete: 1, sort: 0 })),
						...this.formData.list.map(({ category_name, category_id }, index) => ({ 
							category_name, category_id, is_delete: 0, sort: index + 1 
						}))
					];
					this.$request({
						url: '_COLLECT_MAIN_COLLECT_CATEGORY_SAVE',
						type: "POST",
						param,
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const EditCollect = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-collect-main-edit-collect {
	.ivu-form .ivu-form-item-label {
		display: none
	}
	.ivu-modal-content {
		min-height: 150px;
	}
	.ivu-form-item-content {
		margin-left: 0 !important;
		
	}
	.vc-sort-list > div {

		text-align: left !important;
		margin: 5px 10px !important;
	}
	.ivu-form-item {
		margin-bottom: 0px !important;
		&.ivu-form-item-error {
			.ivu-form-item-error-tip {
				margin-left: 10px;
				top: calc(100% - 20px);
			}
			._gray-bg {
				padding-bottom: 20px;
			}
		}
	}

	

}
</style>