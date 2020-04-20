<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="编辑类目"
		class="v-content-circle-edit-category"
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
			<oa-transition-group>
				<i-form-item
					v-for="(option,index) in formData.list"
					:key="option.key"
					:prop="'list.' + index + '.category_name'"
					:rules="rules.category_name"
				>
					<div class="g-bg-gray-mid _gray-bg g-dp-ib g-pd-10 g-m-b-20" style="width:520px" >
						<i-input
							v-model="option.category_name"
							:maxlength="10"
							:placeholder="formData.list.length==1?'请输入类目名称':('类目名称'+(index+1))"
							style="width:300px;top: -2px;"
						/>
						<span class="g-c-black3 g-m-l-10 g-m-r-5">{{ option.material_num || 0 }}条内容</span>
						<span v-if="index !==0" class="g-operation g-m-l-20" @click="handleMoveUp(index)">上移</span>
						<span
							v-if="index !==formData.list.length-1"
							class="g-operation g-m-l-20"
							@click="handleMoveDown(index)"
						>
							下移
						</span>
					</div>
					<span>
						<i
							class="icon iconfont icon-remove-circle g-m-l-10 g-c-red-mid g-pointer"
							style="position: relative;top: 3px;"
							@click="handleDelete(option,index)"
						/>
						<i
							v-if="index==formData.list.length-1"
							class="icon iconfont icon-add1 g-c-blue-mid g-m-l-10 g-pointer"
							style="position: relative;top: 3px;"
							@click="handleAdd(option)"
						/>
					</span>
				</i-form-item>
			</oa-transition-group>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Input, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex, uid } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm.vue';
import { OSS_NO_MESSAGE02 } from '@constants/constants';
import TransitionGroup from '@common/transition-group/transition-group';

export default {
	name: "oa-collect-edit",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-transition-group': TransitionGroup
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
				category_name: [{ required: true, type: 'string', message: "请填写类目名称", trigger: "blur" }]
			},
		};
	},
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
				url: "_CONTENT_CIRCLE_CATEGORY_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				if (!res.data.category_list.length) return;
				this.formData.list = res.data.category_list.map(({ category_name, category_id, material_num }) => {
					return { category_name, category_id, material_num, is_delete: 0, key: uid() };
				});
			}).catch((res) => {
				this.$Message.error(res.msg);
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
		handleDelete(item, index) {
			if (item.material_num) {
				Confirm.popup({
					title: '提示',
					msg: '此类目中存在素材不能删除'

				}).catch(err => err && console.error(err));
				return;
			}
			if (item.category_id) {
				this.formData.list.splice(index, 1);
				item.is_delete = 1;
				this.deleteList.push(item);
			} else this.formData.list.splice(index, 1);
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					const sameNameItem = this.formData.list.find((i, index1) => this.formData.list.find(
						(j, index2) => index1 < index2 && i.category_name === j.category_name
					));
					if (sameNameItem && sameNameItem.category_name) {
						this.$Message.warning('类目名称"' + sameNameItem.category_name + '"重复,请修改');
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
						url: '_CONTENT_CIRCLE_CATEGORY_SAVE_POST',
						type: "POST",
						param,
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleOk();
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
export const EditCategory = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-circle-edit-category {
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
				top: calc(100% - 40px);
			}
			._gray-bg {
				padding-bottom: 20px;
			}
		}
	}
}
</style>