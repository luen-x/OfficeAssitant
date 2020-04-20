<template>
	<div class="v-sale-customer-intention-add-sea v-sale-customer-form g-flex g-jc-c" style="height:inherit">
		<div style="width:925px;position:relative;height:inherit" class="g-flex">
			<div 
				class="_container" 
			>
				<div>
					<span class="g-fs-16" style="font-weight:600"> {{ baseInfo.company_name }} </span>
					<span class="g-c-red-mid g-pointer">{{ tip }}</span>
				</div>
				<!-- <div id="follow_record" class="g-c-red-mid _customer-form-title">跟进记录</div>
				<oa-follow-container v-if="followRecord.length" :list="followRecord"/>
				<div v-else class="g-pd-l-20 g-c-black4">暂无跟进记录</div>

				<div id="turn_record" class="g-c-red-mid _customer-form-title">转手记录</div>
				<i-table v-if="turnRecord.length" :columns="turnColumns" :data="turnRecord" stripe />
				<div v-else class="g-pd-l-20 g-c-black4">暂无转手记录</div> -->

				<div id="base_info" class="g-c-red-mid _customer-form-title">基本信息</div>
				<div class="g-flex g-fw-w _info-item-container">
					<oa-info-item :content="baseInfo.customer_name" label="客户姓名"/>
					<oa-info-item :content="baseInfo.tel" label="电话"/>
					<oa-info-item :content="baseInfo.url" label="官网"/>
					<oa-info-item :content="baseInfo.email" label="邮箱"/>
					<oa-info-item :content="baseInfo.address" tooltip label="地址"/>
					<oa-info-item :content="baseInfo.capital" label="注册资本"/>
					<oa-info-item :content="baseInfo.paid_in_capital" label="实缴资本"/>
					<oa-info-item :content="baseInfo.intellectual_property_right" label="知识产权"/>
					<oa-info-item :content="baseInfo.manage_state" label="经营状态"/>
					<oa-info-item :content="baseInfo.establishment_date" label="成立日期"/>
					<oa-info-item :content="baseInfo.approval_date" label="核准日期"/>
					<oa-info-item :content="baseInfo.credit_code" label="统一社会信用代码"/>
					<oa-info-item :content="baseInfo.taxpayer_number" label="纳税人识别号"/>
					<oa-info-item :content="baseInfo.registration_number" label="注册号"/>
					<oa-info-item :content="baseInfo.organization_code" label="组织机构代码"/>
					<oa-info-item :content="baseInfo.company_type" label="企业类型"/>
					<oa-info-item :content="baseInfo.industry" label="所属行业"/>
					<oa-info-item :content="baseInfo.scale" label="人员规模"/>
					<oa-info-item :content="baseInfo.used_name" label="曾用名"/>
					<oa-info-item :content="baseInfo.manage_range" tooltip label="经营范围"/>
				</div>

				<div id="system_record" class="g-c-red-mid _customer-form-title">系统记录</div>
				<div class="g-flex g-fw-w _info-item-container">
					<oa-info-item :content="sysInfo.staff_name" label="创建人"/>
					<oa-info-item :content="sysInfo.update_time" label="最近更新"/>
					<oa-info-item :content="sysInfo.create_time" label="创建时间"/>
				</div>

				<div id="mark_record" class="g-c-red-mid _customer-form-title">标记记录</div>
				<i-table v-if="markRecord.length" :columns="markColumns" :data="markRecord" stripe />
				<div v-else class="g-pd-l-20 g-c-black4">暂无标记记录</div>
				<div class="g-m-b-20"/>
			
			</div>
			<div style="margin-top:50px;width:180px;margin-left:40px;">
				<i-anchor :affix="false" show-ink container="._container">
					<!-- <i-anchor-link href="follow_record" title="跟进记录"/>
					<i-anchor-link href="turn_record" title="转手记录"/> -->
					<i-anchor-link href="base_info" title="基本信息"/>
					<i-anchor-link href="system_record" title="系统记录"/>
					<i-anchor-link href="mark_record" title="标记记录"/>
				</i-anchor>
			</div>

		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button :loading="saveLoading" type="primary" @click="handleSave">领取</i-button>
		</div>
	</div>
</template>

<script>
import { Table, Anchor, AnchorLink, Button } from 'iview';
import { getItem } from '@utils/utils'; 
import _s from '../_common/customer/cus-form/style.scss';
import InfoItem from '../_common/info-item';
import FollowContainer from './com/follow-container';

export default {
	name: 'oa-tpl',
	components: {
		'i-table': Table,
		'i-anchor': Anchor,
		'i-anchor-link': AnchorLink,
		'i-button': Button,
		'oa-info-item': InfoItem,
		'oa-follow-container': FollowContainer

	},
	data() {
		return {
			query: {
				...this.$route.query
			},
			baseInfo: {
				company_name: "", // 公司名
				customer_name: "", // 客户名
				tel: "", // 电话
				url: "", // 网址
				email: "", // email
				address: "", // 详细地址
				capital: "", // 注册资本
				paid_in_capital: "", // 实缴资本
				manage_state: "", // 经营状态
				establishment_date: "", // 成立时间
				approval_date: "", // 核准日期
				credit_code: "", // 统一社会信用代码
				taxpayer_number: "", // 纳税人识别号
				registration_number: "", // 注册号
				organization_code: "", // 组织机构代码
				company_type: "", // 企业类型
				industry: "", // 所属行业
				scale: "", // 人员规模
				used_name: "", // 曾用名
				manage_range: "", // 经营范围
				exist_time: "", // 存在时间 单位天
				intellectual_property_right: '' // 知识产权
			},
			sysInfo: {
				staff_name: "", // 添加人
				create_time: "", // 创建时间
				update_time: "", // 更新时间
				change_times: "", // 转手次数
			},

			saveLoading: false,
			followRecord: [
				// {
				// 	record_id: 1815,
				// 	remark: "撒打算呆呆阿森打算打算的阿斯顿阿森的", // 备注详情
				// 	staff_id: 1,
				// 	customer_intention: "无意向", // 客户意向
				// 	connect_status: "已接", // 接通状态
				// 	create_time: "2019-11-20 15:13:32", // 创建时间
				// 	head_img: "", // 头像
				// 	staff_name: "超管", // 添加人
				// 	depart_name: "公司", // 添加人部门
				// 	self_fabulous: 1, // 自己是否点赞
				// 	self_not_good: 0, // 自己是否点踩
				// 	fabulous: 1, // 点赞数量
				// 	not_good: 0 // 点踩数量
				// }
			],
			turnColumns: [
				{
					title: '持有人',
					key: 'staff_name',
					width: 100
				},
				{
					title: '部门',
					key: 'depart_name',
					width: 100
				},

				{
					title: '持有天数',
					key: 'holding_time',
					width: 90
				},
				{
					title: '开始时间',
					key: 'own_create_time',
					minWidth: 160
				},
				{
					title: '结束时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '掉入公海类型',
					key: 'change_reason',
					width: 150
				}
			],
			turnRecord: [
				// {
				// 	history_id: 28296,
				// 	assign_staff_id: 0,
				// 	staff_id: 2059,
				// 	depart_id: 77,
				// 	data_source: 1,
				// 	own_create_time: "2019-09-10 10:00:10", // 开始时间
				// 	create_time: "2019-09-10 10:09:54", // 结束时间
				// 	staff_name: "檀国文B", // 负责人
				// 	depart_name: "杭一2部", // 部门
				// 	holding_time: 1, // 持有时间 单位 天
				// 	change_reason: "自动掉入公海" // 转出原因
				// }
			],
			markColumns: [
				{
					title: '标记人',
					key: 'staff_name',
					width: 150,
				},
				{
					title: '部门',
					key: 'depart_name',
					width: 150
				},
				{
					title: '标记原因',
					key: 'type_str',
					width: 150
				},
				// {
				// 	title: '凭证',
				// 	key: 'months',
				// 	width: 150
				// },
				{
					title: '标记时间',
					key: 'create_time',
					minWidth: 150
				},
				{
					title: '联系处理人',
					key: '-',
					width: 150,
					render: (h, param) => {
						return <span>张勇</span>;
					}

				}
			],
			markRecord: [
				//  {
				// 	staff_id: 1979,
				// 	type: 4,
				// 	remark: "", // 备注
				// 	is_delete: 1,
				// 	create_time: "2019-10-22 17:04:55", // 标记时间
				// 	type_str: "已注销", // 标记时间
				// 	staff_name: "杭四三部五", // 标记人
				// 	depart_name: "杭四3部", // 标记人部门
				// 	delete_str: "已取消标记" // 是否已取消
				// }
			]
		};
	},
	computed: {
		tip() {
			return `资料已录入${this.baseInfo.exist_time || 0}天，转手${this.sysInfo.change_times || 0}次`;
		}

	},
	created() {
		this.loadRecord();
	},
	methods: {
		loadRecord() {
			this.$request({
				url: "_SALE_CUSTOMER_ALL_CUSTOMER_INFO_GET",
				type: "GET",
				param: {
					customer_id: this.query.customer_id
				},
				loading: false,
			}).then(res => {
				this.followRecord = res.data.record_log;
				this.turnRecord = res.data.change_log;
				this.baseInfo = res.data.basic_info;
				this.baseInfo.capital = parseFloat(this.baseInfo.capital) >= 0 ? this.baseInfo.capital : '';
				this.baseInfo.paid_in_capital = parseFloat(this.baseInfo.paid_in_capital) >= 0 ? this.baseInfo.paid_in_capital : '';
				this.sysInfo = res.data.system;
				this.markRecord = res.data.sign_list;

			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleCancel() {
			this.$router.push('/sale/customer/intention/add');
		},
		handleSave() {
			this.$request({
				url: "_SALE_SEA_GET_CUSTOMER_POST",
				type: "GET",
				param: {
					customer_id: this.query.customer_id
				},
				loading: false,
			}).then(res => {
				if (res.data.error_code) {
					this.$Message.error(res.data.error_msg);
				} else {
					this.$Message.success(res.msg);
					this.$router.push('/sale/customer/intention/add');
				}
				
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-sale-customer-intention-add-sea {
	._container {
		overflow:auto;
		// padding-right:40px;
		border-right:1px solid #e7e7e7;
		margin-top:30px;
		margin-bottom:60px
	}
	._info-item-container {
		.v-sale-customer-info-item{
			&:nth-of-type(2n-1){
				margin-right:85px
			}
			&:nth-of-type(2n){
				margin-right:0px
			}
			width:340px;
		} 
	}
}
</style>
