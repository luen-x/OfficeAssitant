<template>
	<div class="v-sale-customer-intention-add-sea-follow-item g-box-shadow g-pd-tb-10 g-m-b-20">
		<div >
			
			<img v-if="data.head_img" :src="data.head_img" class="_head-img">
			<span v-else class="_head-name">{{ data.staff_name.substr(data.staff_name.length-2) }}</span>
		</div>
		<div class="g-col" >
			<div style="color:#4b4f57;margin-top: 10px;">
				<span style="width:120px" class="g-dp-ib">{{ data.staff_name }} ({{ data.depart_name }})</span>
				<span style="width:120px" class="g-dp-ib">接通状态：{{ data.connect_status }}</span>
				<span style="width:120px" class="g-dp-ib">意向：{{ data.customer_intention }}</span>
				<span style="width:120px;color:#999999;margin-right:20px" class="g-dp-ib g-fr">{{ data.create_time }}</span>
			</div>
			<div 
				class="g-m-t-20 _remark-content">
				{{ data.remark }}
			</div>
			<div class="g-m-tb-10" style="color:#BBBBBB">
				<i 
					:style="{color:data.self_fabulous?'#F49A58':'#BBBBBB'}" 
					class="icon iconfont g-m-l-10 icon-zan g-pointer"
					@click="handleGood"
				/> 
				( {{ data.fabulous }} )
				<i 
					:style="{color:data.self_not_good?'#F49A58':'#BBBBBB',top:'5px'}" 
					class="icon iconfont g-m-l-30 icon-cai g-pointer g-relative"
					@click="handleBad"
				/> 
				( {{ data.not_good }} )
			</div>

		</div>
		
	</div>
</template>
<script>

export default {
	name: 'oa-',
	components: {
	
	},
	props: {
		data: {
			type: Object,
			default: () => ({
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
			})
		}

	},
	data() {
		return {
			commentLoading: false
		};
	},
	methods: {
		handleGood() {
			// if (this.data.self_fabulous) return;
			this.comment(1);


		},
		handleBad() {
			// 	if (this.data.not_good) return;
			this.comment(2);
		},
		comment(type) {
			if (this.commentLoading) return;
			const record = this.data;
			this.$request({
				url: "_SALE_SALE_LOG_COMMENT_POST",
				type: "POST",
				param: {
					record_id: record.record_id,
					type
				},
				loading: false,
				autoTip: true
			}).then(res => {
				if (type == 1) {
					if (record.self_fabulous) {
						record.self_fabulous = 0;
						record.fabulous--;
					} else {
						record.fabulous++;
						record.self_fabulous = 1;
					}
					
				} else if (type == 2) {
					if (record.self_not_good) {
						record.self_not_good = 0;
						record.not_good--;
					} else {
						record.self_not_good = 1;
						record.not_good++;
					}
				}
				
			}).catch((res) => {
				console.error(res);
			}).finally(() => {
				this.commentLoading = false;
			});
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-intention-add-sea-follow-item {
	display: flex;
	._head-img {
		height: 40px;
		width: 40px;
		display: inline-block;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 10px;
	}
	._head-name {
		height: 40px;
		width: 40px;
		display: inline-block;
		border-radius: 20px;
		color: white;
		background: #e84854;
		line-height: 40px;
		text-align: center;
		margin-left: 20px;
		margin-right: 10px;
	}
	._remark-content {
		min-height:70px;
		border-top:1px solid #F3F3F3;
		border-bottom:1px solid #F3F3F3;
		margin-right:50px;
		padding-top:10px;
		padding-bottom:15px

	}

}
</style>