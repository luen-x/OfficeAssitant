<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400"
		title="添加信息来源"
		class="v-sale-customer-source-item"
		@on-ok="handleAddSource"
		@on-cancel="handleCancel"
	>
		<div class="g-flex g-jc-c">
			<div>
				<div class="g-flex">
					<div style="padding-top: 6px;width:100px;padding: 10px 12px 10px 0;" class="g-tr">已添加：</div>
					<div style="width:220px;">
						<span v-for="(item,index) in sources" :key="index" class="_source-item">
							{{ item.source_name }}
							<i
								class="icon iconfont icon-close2 g-pointer"
								style="font-size: 12px;"
								@click="handleDelete(item.source_id)"
							/>
						</span>
					</div>
				</div>
				<div class="g-m-t-20">
					<i-form
						ref="form"
						:model="formData"
						:rules="rules"
						label-width="100"
						inline
						@submit.native.prevent
					>
						<i-form-item label="新信息来源：" prop="name" style="width:320px">
							<i-input v-model="formData.name" style="width:220px"/>
						</i-form-item>
					</i-form>
				</div>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem
	},
	mixins: [orderModal],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			// saveLoading: false,
			sources: [],
			formData: {
				name: ""
			},
			rules: {
				name: [{ required: true, message: "请输入信息来源", trigger: "blur" }]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	created() {
		this.loadSouce();
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
		loadSouce() {
			this.$request({
				url: API._SALE_INTENTION_SOURCE_LIST_GET,
				type: "POST",
				loading: false
			}).then((res) => {
				this.sources = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleAddSource() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: API._SALE_SYSTEM_ADD_SOURCE_POST,
						type: "POST",
						param: {
							source_name: this.formData.name
						},
						loading: false
					})
						.then((res) => {
							this.$Message.success(res.msg);
							this.handleOk();
						// this.loadSouce();
						})
						.catch((res) => {
							console.error(res.msg);
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(res.msg);
						});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleDelete(id) {
			this.$request(
				{
					url: API._SALE_SYSTEM_DEL_SOURCE_POST,
					type: "POST",
					param: { source_id: id },
					loading: false
				}
			).then((res) => {
				this.$Message.success(res.msg);
				this.loadSouce();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

export const AddSource = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
.v-sale-customer-source-item {
    ._source-item {
        border-radius: 2px;
        padding: 1px 5px 1px 5px;
        display: inline-block;
        background-color: #e84854;
        color: white;
        margin: 5px;
		cursor: pointer;
		&:hover{
			background-color: #fa646e;
		}
    }
}
</style>

