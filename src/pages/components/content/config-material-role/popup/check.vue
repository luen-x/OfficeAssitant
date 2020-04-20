<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="查看"
		class-name="v-content-config-reject-apply"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-t-10 g-pd-lr-25">
			<div v-if="apply.is_invalid" class="g-m-b-20 g-c-red-mid" >{{ apply.is_invalid }}</div>
			<div>
				<span class="g-c-black3">申请素材：</span>
				<span class="g-c-black2">{{ apply.material_name }}</span>
			</div>
			<div class="g-m-t-20 g-flex">
				<span class="g-c-black3">申请流程：</span>
				<oa-across-table :data="list" :mode="mode">
					<div slot-scope="item" class="g-c-black2 g-flex g-flex-cc g-fd-c">
						<div :style="{color:item.item.step==1?'#2397F9': '#4B4F57'}" style="margin-top:10px">
							{{ item.item.step_name }}
						</div>
						<div v-if=" item.item.step==1" style="margin-top:5px">
							{{ item.item.audit_staff_name }}
						</div>
					</div>
				</oa-across-table>

			</div>
			<div v-if="apply.refuse_reason.length>0" class="g-m-t-20">
				<span class="g-c-black3">驳回原因：</span>
				<span class="g-c-black2" style="word-break: break-all;">{{ apply.refuse_reason[0] }}</span>
			</div>
			<div class="g-m-t-20 g-flex">
				<span style="width:60px" class="g-c-black3">申请理由：</span>
				<span style="word-break: break-all;flex: 1;" class="g-c-black2">{{ apply.apply_reason }}</span>
			</div>
		</div>

		<div slot="footer">
			<i-button v-if="0" class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import AcrossTable from "@components/_common/across-table/across-table";
import API from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";

export default {
	name: "v-trained-tape",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button,
		'oa-across-table': AcrossTable
	},
	mixins: [
		services.departMy()
	],
	props: {
		data: Object
	},
	data() {
		return {
			mode: 'other',
			visible: false,
			list: [
				{ status: 1 },
				{ status: 2 },
				{ status: 3 }
			],
			apply: {
				refuse_reason: [],
				material_name: '',
				is_invalid: '',
				apply_reason: '',

			}

		};
	},
	computed: {
	},
	created() {
		this.loadData(this.data.apply_id);

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData(apply_id) {
			this.$request({
				url: API._CONTENT_CONFIG_MATERIAL_APPLY_AUDIT_GET,
				type: "get",
				param: {
					apply_id
				}
			}).then(res => {
				this.list = res.data.audit_info;
				Object.keys(res.data).forEach(key => {
					this.apply[key] = res.data[key];
				});
			});
		},
		handleOk() {
		/**
         * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
         */
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const Check = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-config-reject-apply{
 .ivu-checkbox-group-item{
	 margin-bottom: 10px;
 }
 .c-across-table{
	 margin-top: 0 !important;
 }

}

</style>

