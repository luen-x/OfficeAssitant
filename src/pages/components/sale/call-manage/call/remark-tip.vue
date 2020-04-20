<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="温馨提示"
		width="400" 
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-20 g-pd-t-20">
			<div class="g-c-red-mid">
				若添加无明确意义的表述，经举报后会受到处罚，请如实举报。
				<span v-if="coinConfig.tip_9_1">（{{ coinConfig.tip_9_1 }}）</span>
				<br><br>
				例如“11、fds、范德萨”等表述。
			</div>
			<!-- <div>
				<i-checkbox v-model="checked" @on-change="handleCheck">我已了解今日不再提醒</i-checkbox>
			</div> -->
		</div>
		<div slot="footer" class="g-flex g-jc-sb">
			<i-checkbox v-model="checked" class="g-m-l-20" @on-change="handleCheck" >我已了解今日不再提醒</i-checkbox>
			<i-button type="primary" size="large" @click="handleOk">确认</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, Checkbox } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex, getItem, setItem } from '@utils/utils';
import moment from 'moment';
import { Confirm } from '@common/confirm/confirm.vue';
import { services } from '@stores/services/sale';


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
		'i-checkbox': Checkbox
	},
	mixins: [services.coinConfig()],
	props: {
		
		
	},
	data() {
		return {
			visible: false,
			checked: false,
			date: moment().format("YYYY-MM-DD")
			
		};
	},
	created() {
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
		handleCheck(bool) {
			if (bool) {
				setItem('tipMarkErrorLinkTime_' + this.$global.version, this.date);
			} else {
				setItem('tipMarkErrorLinkTime_' + this.$global.version, '');

			}
			
		}
	}
};
export const RemarkTip = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>