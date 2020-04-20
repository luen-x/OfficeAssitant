<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-rank-up-rule-modal"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			新增规则
		</div>

		<div class="g-fs-14 g-m-t-15 _content">
			<div class="_title g-flex g-ai-c g-m-b-10 g-m-l-15">
				<div class="_left"/>
				<div class="_right">固定规则</div>
			</div>
			<div class="g-m-b-20 _basic">
				<div
					v-for="item in regular_rules"
					:key="item.label"
					class="g-lh-34 _item">
					<i-checkbox v-if="!item._disabled" v-model="item.is_choose">
						{{ item.rule_name }}{{ item.description ? '（'+ item.description + '）' : '' }}
					</i-checkbox>
					<i-checkbox v-else :value="true" disabled>
						{{ item.rule_name }}{{ item.description ? '（'+ item.description + '）' : '' }}
					</i-checkbox>
				</div>
			</div>
			<div class="_title g-flex g-ai-c g-m-b-10 g-m-l-15">
				<div class="_left"/>
				<div class="_right">自定义规则</div>
			</div>
			<div class="_self">
				<div
					v-for="item in man_made_rules"
					:key="item.label"
					class="g-lh-34 _item">
					<i-checkbox v-if="!item._disabled" v-model="item.is_choose">
						{{ item.rule_name }}{{ item.description ? '（'+ item.description + '）' : '' }}
					</i-checkbox>
					<i-checkbox v-else :value="true" disabled>
						{{ item.rule_name }}{{ item.description ? '（'+ item.description + '）' : '' }}
					</i-checkbox>
				</div>
			</div>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Checkbox } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";

export default {
	name: "hr-employee-rank-up-rule-modal",
	components: {
		"i-modal": Modal,
		"i-checkbox": Checkbox,
		"vc-copy": Copy,
	},
	props: {
		data: Object,
		list: Array
	},
	data() {
		return {
			visible: false,
			regular_rules: [],
			man_made_rules: []
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_RULE_DATABASE_GET',
				type: "POST",
				param: {
					...this.data
				},
				loading: false
			}).then(res => {
				this.regular_rules = res.data.regular_rules;
				this.man_made_rules = res.data.man_made_rules;

				// 初始化默认选中值及不可选的
				if (this.regular_rules.length) {
					this.regular_rules.forEach((item, index) => {
						this.regular_rules[index]._disabled = item.is_choose === 1;
						this.regular_rules[index].is_choose = item.is_choose === 1;
					});
				}
				if (this.man_made_rules.length) {
					this.man_made_rules.forEach((item, index) => {
						this.man_made_rules[index]._disabled = item.is_choose === 1;
						this.man_made_rules[index].is_choose = item.is_choose === 1;
					});
				}
				// 再次新增数据改变
				if (this.list.length) {
					this.list.forEach(ele => {
						if (this.regular_rules.length) {
							this.regular_rules.forEach((item, index) => {
								if (ele.pro_rule_id === item.pro_rule_id) {
									this.regular_rules[index].is_choose = true;
								}
							});
						}
						if (this.man_made_rules.length) {
							this.man_made_rules.forEach((item, index) => {
								if (ele.pro_rule_id === item.pro_rule_id) {
									this.man_made_rules[index].is_choose = true;
								}
							});
						}
					});
				}
			}).catch(error => {});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs.modal.buttonLoading = false;
			// 新增规则
			this.$emit('sure', { regular_rules: this.regular_rules, man_made_rules: this.man_made_rules });
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-rule-modal {
	._title {
		._left {
			display: inline-block;
			width: 2px;
			height: 16px;
			background: #e84854;
			margin-right: 10px;
		}
		._right {
			display: inline-block;
			color: #e84854;
			font-size: 16px;
		}
	}
	._content {
        max-height: 600px;
        overflow-y: auto;
        ._basic, ._self {
            margin-left: 15px;
        }
    }
}
</style>

<style lang="scss">
.v-hr-employee-rank-up-rule-modal {
    ._item {
        padding-left: 2px;
        margin-left: -2px;
        .ivu-checkbox-wrapper {
            display: flex;
            .ivu-checkbox {
                margin-top: 10px;
                margin-right: 10px;
            }
        }
    }
}
</style>
