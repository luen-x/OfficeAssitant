<template>
	<div class="v-sc-main-lastest-news g-m-tb-20">
		<div class="g-flex g-jc-sb g-m-b-20">
			<oa-title title="最新资讯"/>
			<div 
				class="g-pointer g-pd-t-5" 
				style="color: #2397f9;"
				@click="handleClickMore"
			>
				查看更多
			</div>
		</div>

		<div class="g-bg-white g-pd-tb-10 _content">
			<ul class="g-pd-lr-10 g-fs-12">
				<div v-if="list.length">
					<li 
						v-for="(item, index) in list"
						:key="index"
						class="g-pointer g-pd-tb-10 g-bb"
						@click="handleConsultation(item)"
					>
						<p>{{ item.title }}</p>
						<p class="g-c-black4 g-m-t-5">
							<span>{{ item.staff_name }}</span>  
							<span class="g-m-l-20">{{ item.create_date }}</span>
						</p>
					</li>
				</div>
				<div v-else class="g-flex g-fd-c g-ai-c g-jc-c g-pd-t-30" style="height: 100%;">
					<img :src="OSS_NO_MESSAGE03" alt="" style="width:250px;height:180px;">
					<span>暂无任何资讯通知</span>
				</div>
			</ul>
		</div>
	</div>
</template>

<script>
import { OSS_NO_MESSAGE03 } from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import Title from "./title";

export default {
	components: {
		"oa-title": Title
	},
	data() {
		return {
			OSS_NO_MESSAGE03,
			list: []
		};
	},
	created() {
		this.getNewdata();
	},
	methods: {
		handleClickMore() {
			this.$router.push({
				path: '/sc/main/information',
				query: {
					is_control_role: 1
				}
			});
		},
		getNewdata() {
			this.$request({
				url: API_ROOT._SALE_MAIN_MATERIAL_NEW_LIST_GET,
				type: "get",
				param: {}
			}).then(res => {
				this.list = res.data;
			});
		},

		handleConsultation(v) {
			this.$router.push(
				{ 
					path: '/sc/consultation',
					query: {
						keyword: v.keyword, 
						status: 5,
						information_id: v.information_id
					} 
				}
			);
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-lastest-news{
	width: 330px;

    ._content{
		height: 155px;
		overflow-y: hidden;

		&:hover {
			overflow-y: auto;
		}
    }
}
</style>