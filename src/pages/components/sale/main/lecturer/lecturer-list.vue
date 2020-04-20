<template>
	<div class="sale-main-lecturer-lecturer-list g-flex g-fw-w g-jc-sb">
		<div v-for="(item,index) in list" :key="index" class="_block g-m-t-20">
			<div class="g-flex">
				<div class="g-c-black1 g-m-r-10">
					{{ item.name }}
				</div>
				<div>
					<span v-if="splitBusinessStaffs(item.business_staffs).length<4">
						<span v-for="(ele,i) in splitBusinessStaffs(item.business_staffs)" :key="i">
							<span>{{ ele }}</span>
							<span v-if="i<splitBusinessStaffs(item.business_staffs).length-1" class="g-m-lr-5">|</span>
						</span>
					</span>
					<i-poptip v-else trigger="hover">
						<span v-for="(ele,i) in splitBusinessStaffs(item.business_staffs)" :key="i">
							<template v-if="i<3">
								<span>{{ ele }}</span>
								<span v-if="i<2">|</span>
							</template>
						</span>...
						<div slot="content">
							<span v-for="(ele,i) in splitBusinessStaffs(item.business_staffs)" :key="i">
								<span>{{ ele }}</span>
								<span v-if="i<splitBusinessStaffs(item.business_staffs).length-1" class="g-m-lr-5">|</span>
							</span>
						</div>
					</i-poptip>
				</div>
			</div>
			<div class="g-m-t-10 g-tl">
				出差时间:{{ item.start_date }}至{{ item.end_date }}
			</div>
		</div>
		<div
			v-if="list.length"
			class="_bottom g-operation"
			@click="handleMore"
		>看课程表</div>
		<div
			v-else
			style="width: 100%;"
			class="g-flex-ac g-flex-cc g-fd-c">
			<img :src="OSS_SEARCH_EMPTY" style="height:120px">
			<div>
				暂无信息
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { Poptip } from 'iview';
import { OSS_SEARCH_EMPTY } from "@constants/constants";

export default {
	components: {
		'i-poptip': Poptip,
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			list: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleMore() {
			this.$router.push('/sale/full/lecturer');
		},
		loadData() {
			this.$request({
				url: '_SALE_MAIN_BUSINESS_LESSON_LECTURER_GET',
				type: "get",
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		splitBusinessStaffs(v) {
			if (v == '') return [];
			return v.split('|');
			// return ['超管', '五战员工', '超管', '五战员工', '超管', '五战员工'];
		}
	}
};
</script>

<style lang="scss">
.sale-main-lecturer-lecturer-list{
	height: 220px;
	overflow:auto;
	margin:0 5%;
	._block{
		width: 380px;
		height: 68px;
		background:#F8F8F8;
		padding:10px 16px;
	}
	._bottom{
		width: 100%;
		position: absolute;
		bottom: 20px;
	}
}
.sale-main-lecturer-lecturer-list:after{
    content: '';
    width: 240px;
    border:1px solid transparent;
  }
</style>
