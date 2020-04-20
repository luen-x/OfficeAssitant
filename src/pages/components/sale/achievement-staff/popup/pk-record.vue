<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="PK业绩记录"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex-cc" style="min-height:200px;">
			<oa-record v-if="records.length" :records="records">
				<template slot-scope="{data}">
					<div>
						<span class="g-m-r-20">{{ data.create_time }}</span>
						<span class="g-c-black3">PK业绩:{{ data.amount_after }}</span>
					</div>
					<div class="g-m-t-10 g-c-black4">
						{{ data.describe }}
					</div>
				</template>
			</oa-record>
			<div v-else>暂无数据</div>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import Record from '@components/sale/_common/record';

export default {
	name: "oa-sale-",
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
		'oa-record': Record
	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			records: [
			],
			formData: {
				prop: ''
			},
			rules: {
				prop: []
			}
		};
	},
	created() {
		this.$request({
			url: '_SALE_ACHIEVEMENT_STAFF_PK_RECORD_GET',
			type: "GET",
			param: {
				...this.data
			},
			loading: false
		}).then(res => {
			this.records = res.data;
		}).catch((res) => {

		});
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
		handleSave() {
			this.visible = false;
			this.$emit('sure');
		}
	}
};
export const PKRecord = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>
