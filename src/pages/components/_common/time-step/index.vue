<template>
	<div class="v-sale-customer-intention-add-follow-container">
		<div v-for="(month,i) in rebuildList" :key="month.month">
			<div >
				<span class="g-fs-16">{{ month.monthSplit[0] }}</span>
				<span style="color:#BBBBBB">/ {{ month.monthSplit[1] }}</span>
			</div>
			<div v-for="(date,index) in month.days" :key="date.date">
				<div style="width:41px;color:#4B4F57" class="g-tc" >
					{{ date.date }}
				</div>
				<div
					:style="{borderColor:(i===0 && index===0) ?'#2397f9':'#D4D4D4'}" 
					style="border-left:1px dashed;padding-left:20px;margin-left:20px;position:relative"
				>
					<span :style="{background:(i===0 && index===0)?'#2397f9':'#D4D4D4'}" class="_dot"/>
					<slot v-for="(record) in date.list" :data="record"/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import moment from 'moment';

export default {
	name: 'oa-commom-time-step-container',
	components: {
	
	},
	props: {
		list: {
			type: Array,
			default: () => [ // 销售记录
				{
					"record_id": 1815,
					"remark": "请问请问", // 备注详情
					"staff_id": 1,
					"customer_intention": "无意向", // 客户意向
					"connect_status": "已接", // 接通状态
					"create_time": "2019-09-11 15:13:32", // 创建时间
					"head_img": "", // 头像
					"staff_name": "超管", // 添加人
					"depart_name": "公司", // 添加人部门
					"self_fabulous": 1, // 自己是否点赞
					"self_not_good": 0, // 自己是否点踩
					"fabulous": 1, // 点赞数量
					"not_good": 0 // 点踩数量
				}
			]
		},
		timeKey: {
			type: String,
			default: "create_time"
		}

	},
	data() {
		return {
			rebuildList: this.getRebuildList()
		};
	},
	watch: {
		list(val) {
			this.rebuildList = this.getRebuildList();
		}

	},
	methods: {
		getRebuildList() {
			const result = [];
			
			const today = moment().format('MM-DD');
			const yestoday = moment().subtract(1, 'day').format('MM-DD');
			this.list.forEach(item => {
				const date = moment(item[this.timeKey]);
				const month = date.format('M月/YYYY年');
				let existMonth = result.find(it => it.month == month);

				if (!existMonth) {
					existMonth = { month, monthSplit: month.split('/'), days: [] };
					result.push(existMonth);
				}
				let shortDay = date.format('MM-DD');
				if (shortDay == today) shortDay = '今日';
				if (shortDay == yestoday) shortDay = '昨日';
				let existDate = existMonth.days.find(it => it.date == shortDay);
				if (!existDate) {
					existDate = { date: shortDay, list: [] };
					existMonth.days.push(existDate);
				}
				existDate.list.push(item);
			});
			return result;
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-intention-add-follow-container {
	._dot {
		display: inline-block;
		position: absolute;
		height:8px;
		width: 8px;
		background: #e7e7e7;
		left:-4px;
		// top: -4px;
		border-radius: 4px;
	}
}
</style>