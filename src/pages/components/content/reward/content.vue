<template>
	<div class="v-content-reward-content" >
		<div>
			<div class="g-form-title"> 奖励设置</div>
			<oa-reward-item
				ref="reward"
				:condition-list="meansType"
				:check-type="2"
				:data-source="settingInfo.list"
				scenes="1"
				title="旧资料更新"
				msg="每更新"/>
			<oa-reward-item
				ref="reward"
				:check-type="2"
				:condition-list="[{ label: '标记确认通过', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="2"
				title="标记资料成功"
				msg="每标记"/>
			<oa-reward-item
				:check-type="2"
				:data-source="settingInfo.list"
				:condition-list="[{ label: '通话接通', value: '1' }]"
				scenes="3"
				title="OA打电话"
				msg="每天打">
				<template slot="rule" slot-scope="{rules}">
					<i-input-number :min="1" :max="100" v-model="rules.connect_time" style="margin-left: -10px !important;"/>秒
				</template>
			</oa-reward-item>
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '点赞净增量', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="4"
				title="优选的跟进记录"
				msg="每达标">
				<template slot="rule" slot-scope="{rules}">
					<i-input-number :min="1" :max="100" v-model="rules.zan" style="margin-left: -10px !important;"/>个
					<!-- <i-input-number :min="1" :max="100" v-model="rules.limit.limit_num"/>%， -->
				</template>
			</oa-reward-item>
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '举报成功', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="5"
				title="举报跟进记录成功"
				msg="每通过" />
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '举报成功', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="15"
				title="举报公司关联成功"
				msg="每通过" />
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '一天内录账', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="6"
				title="录账"
				msg="每通过" />
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '24小时内下单', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="7"
				title="下单"
				msg="每通过" />
		</div>
		<div class="g-m-t-40">
			<div class="g-form-title">惩罚设置</div>
			<oa-reward-item
				:check-type="2"
				:limit="false"
				:condition-list="[{ label: '核实被举报的跟进记录为无效信息', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="9"
				policy-type="2"
				title="无效的跟进记录"
				msg="每核实" />
			<oa-reward-item
				:check-type="2"
				:limit="false"
				:condition-list="[{ label: '核实被举报的公司关联错误', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="10"
				policy-type="2"
				title="错误的公司关联"
				msg="每核实" />
			<oa-reward-item
				:check-type="2"
				:limit="false"
				:condition-list="[{ label: '核实资料标记错误', value: '1' }]"
				:data-source="settingInfo.list"
				scenes="11"
				policy-type="2"
				title="标记资料被驳回"
				msg="每核实" />
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '核实虚假举报了他人的跟进记录', value: '1' },]"
				:data-source="settingInfo.list"
				:limit="false"
				scenes="12"
				policy-type="2"
				title="举报跟进记录被驳回"
				msg="每核实" />
			<oa-reward-item
				:check-type="2"
				:condition-list="[{ label: '核实虚假举报了他人的公司关联', value: '1' },]"
				:data-source="settingInfo.list"
				:limit="false"
				scenes="16"
				policy-type="2"
				title="举报公司关联驳回"
				msg="每核实" />
		</div>
		<footer class="g-flex-cc">
			<span class="g-m-r-20">生效时间：{{ settingInfo.effect_time }}</span>
			<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
			<vc-debounce-click class="g-red-btn-small" @click="handleSubmit">保存</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import { CheckboxGroup, Checkbox, InputNumber, Select, Option, Input, Radio, RadioGroup } from 'iview';
import RewardItem from './reward-item';
import { SelectTime } from './popup/selectTime';

export default {
	name: 'oa-tpl',
	components: {
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-input-number': InputNumber,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'oa-reward-item': RewardItem,

	},

	data() {
		const meansType = [
			{ label: '白名单的旧资料', value: '1' },
			{ label: '黑名单的旧资料', value: '2' },
			{ label: '公海中的资料', value: '3' },
			// eslint-disable-next-line vue/no-parsing-error
			{ label: '个人已领取的旧资料', value: '4' },
			// eslint-disable-next-line vue/no-parsing-error
			{ label: '个人已成交的旧资料', value: '5' }
		];
		const telTime = [
			{ label: '无', value: '0' },
			{ label: '通话接通', value: '1' },
			{ label: '通话接通30秒', value: '2' },
			{ label: '通话接通60秒', value: '3' },
			{ label: '通话接通90秒', value: '4' },
			{ label: '通话接通120秒', value: '5' }
		];
		const summaryNum = [
			{ label: '无', value: '0' },
			{ label: '跟进记录达20字，并获得其他部门2个赞', value: '1' },
			{ label: '跟进记录达40字，并获得其他部门2个赞', value: '2' },
			{ label: '跟进记录达60字，并获得其他部门2个赞', value: '3' },
			{ label: '跟进记录达80字，并获得其他部门2个赞', value: '4' },
			{ label: '跟进记录达100字，并获得其他部门2个赞', value: '5' }];
		const notes = [
			{ label: '错误的公司关联举报被驳回', value: '1' },
			{ label: '跟进记录举报被驳回', value: '2' }];
		return {
			meansType,
			telTime,
			summaryNum,
			notes,
			settingInfo: {
				effect_time: '',
				list: []
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_CONTENT_REWARD_SETTING_INFO_GET',
				type: "get",
			}).then(res => {
				this.settingInfo = res.data;
			}).catch((err) => {
				console.error(err);
			});
		},
		handleCancel() {
			this.loadData();
		},
		handleSubmit() {
			const setList = {
				1: '旧资料更新',
				2: '标记资料',
				3: 'OA打电话',
				4: '优选的跟进记录',
				5: '举报跟进记录成功',
				15: '举报公司关联成功',
				6: '录账',
				7: '下单',
				9: '无效的跟进记录',
				10: '错误的公司关联',
				11: '标记资料被驳回',
				12: '举报跟进记录被驳回',
				16: '举报公司关联被驳回',
				 };
			let setting = [];
			let validate = true;
			this.$children.forEach(ele => {
				let com = {
					 ...ele._data,
					 rules: { ...ele._data.rules }
				 };
				com.rules.is_limit = Number(com.rules.is_limit);
				if (com.scene != 3) { delete com.rules.connect_time; }
				if (com.scene != 4) { delete com.rules.zan; }
				if (Array.isArray(com.check_list) && com.check_list[0] > 0) {
					if (this.rulesValidate(com.rules)) {
						if (com.rules.is_limit && (com.rules.limit.limit_num < com.rules.coins) && validate) {
							this.$Message.error(setList[com.scene] + '的微币上限数量设置不能少于微币获取量');
							validate = false;
						} else {
							setting.push(com);
						}
					} else if (validate) {
						this.$Message.error(setList[com.scene] + '规则设置请填写完整');
						validate = false;
					}
				} else if (!Array.isArray(com.check_list) && com.check_list) {
					com.check_list = [com.check_list];
					if (this.rulesValidate(com.rules)) {
						if (validate && com.rules.is_limit && (com.rules.limit.limit_num < com.rules.coins)) {
							this.$Message.error(setList[com.scene] + '的微币上限数量设置不能少于微币获取量');
							validate = false;
						} else {
							setting.push(com);
						}
					} else if (validate) {
						this.$Message.error(setList[com.scene] + '规则设置请填写完整');
						validate = false;
					}
				}
			});
			validate && SelectTime.popup({
				setting,
				effect_time: this.settingInfo.effect_time
			}).then(() => { this.loadData(); }).catch(err => { err && console.error(err); });
		},
		rulesValidate(obj) {
			const keys = Object.keys(obj);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (obj[key] == null) {
					return false;
				}
			}
			if (obj.is_limit) {
				return this.rulesValidate(obj.limit);
			} else {
				return true;
			}
		}
	},
};
</script>

<style lang="scss">
	.v-content-reward-content{
		padding: 30px 40px;
		margin-bottom: 80px;
		._border{
			display:inline-block;
			vertical-align: text-top;
			width:2px;
			height: 16px;
			margin-right: 5px;
			background: #E74854
		}
		.ivu-checkbox{
			margin-right: 5px;
		}
		.ivu-input-number{
			margin: 0 5px !important
		}
		footer {
            position: absolute;
            bottom: 0;
            z-index: 2;
            left: 0;
            background-color: #ffffff;
            width: 100%;
            height: 60px;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
	}
</style>
