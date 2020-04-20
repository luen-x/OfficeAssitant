<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加标签"
		class="v-sale-add-tag"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div>
			<i-tag
				v-for="(item,index) in tags"
				:key="index"
				:checked="item.checked"
				checkable
				closable
				color="error"
				style="border-radius: 2px"
				@on-close="deleteSysTag(item.label_id)"
				@on-change="handleToggle(item.label_id)"
			>
				{{ item.label_name }}
			</i-tag>

			<i-input
				v-if="showInput"
				v-model="inputTagName"
				class="_input"
				palceholder="标签名称"
				@on-enter="addSysTag"
				@on-blur="addSysTag"
			/>
			<i v-else class="iconfont icon-add1 g-operation _add-icon" @click="showInput = true"/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Tag, Button, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import orderModal from '@extends/mixins/orderModal';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: "oa-sale-add-tag",
	components: {
		'i-modal': Modal,
		'i-tag': Tag,
		'i-button': Button,
		'i-input': Input
	},
	mixins: [orderModal],
	props: {
		data: {
			type: Object,
			default: () => {
				return { curTags: [] };
			}
		},
	},
	data() {
		return {
			visible: false,
			first: true,
			showInput: false,
			inputTagName: '',
			tags: [
			],
			activeTags: this.data.curTags.map(item => {
				return item.label_id;
			})
		};
	},
	created() {
		this.loadSysTag();
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
		handleToggle(id) {
			const tag = this.tags.find(it => {
				return it.label_id === id;
			});
			if (tag) {
				tag.checked = !tag.checked;
				this.$forceUpdate();
			}
		},
		loadSysTag() {
			this.$request({
				url: "_SALE_SYSTEM_SYSTEM_LABEL_GET",
				type: "GET",
				param: {
				},
				loading: false,
			}).then(res => {
				if (this.first) {
					this.first = false;
					res.data.forEach(it => {
						const exist = this.activeTags.includes(it.label_id);
						if (exist) it.checked = true;
						else it.checked = false;
					});
				} else {
					res.data.forEach(it => {
						const oldItem = this.tags.find(oldIt => {
							return it.label_id == oldIt.label_id;
					 });
					 if (oldItem) {
						 it.checked = oldItem.checked;
					 } else {
						  it.checked = false;
					 }
					});

				}
				this.tags = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		addSysTag: debounce(function () {
			this.$request({
				url: "_SALE_SYSTEM_ADD_CUSTOMER_LABEL_POST",
				type: "POST",
				param: { label_name: this.inputTagName },
				loading: false,
			}).then(res => {
				this.loadSysTag();
				this.showInput = false;
				this.inputTagName = '';
				this.$Message.success(res.msg);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}, 200),
		deleteSysTag(id) {
			if (this.tags.find(item => item.label_id == id).use == 1) {
				Confirm.popup({ title: "确认删除", msg: "该标签已被使用，删除后将会从对应的使用处删除，确认删除吗" })
					.then(() => {
						this.$request({
							url: "_SALE_SYSTEM_DELETE_CUSTOMER_POST",
							type: "POST",
							param: { label_id: id },
							loading: false,
						}).then(res => {
							this.loadSysTag();
							this.$Message.success(res.msg);
						}).catch((res) => {
							this.$Message.error(res.msg);
						});
					}).catch(() => {});

			} else {
				this.$request({
					url: "_SALE_SYSTEM_DELETE_CUSTOMER_POST",
					type: "POST",
					param: { label_id: id },
					loading: false,
				}).then(res => {
					this.loadSysTag();
					this.$Message.success(res.msg);
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}
		},
		handleSave: debounce(function () {
			const ids = this.tags.filter(item => item.checked).map(item => item.label_id);
			const param = {
				contract_company_id: this.data.contract_company_id, // 客户合同公司ID
				label_id: ids
			};
			this.$request({
				url: "_SALE_DEAL_CUSTOMER_LABEL_POST",
				type: "POST",
				param,
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleOk();
			}).catch((res) => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(res.msg);
			});
		}, 200)
	}
};

export const AddTag = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" >
.v-sale-add-tag{
	.ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked){
		background: #f7f7f7
	}
	._input{
		width: 80px;
		input{
			height: 24px;
		}
	}
	._add-icon{
		font-size: 15px;
		line-height: 15px;
		text-align: center;
		position: relative;
		top: 3px;
	}
}

</style>

