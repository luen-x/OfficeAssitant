<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		width="680px"
		title="查看分类"
		footer-hide
		class="v-content-activity"
		@on-cancel="handleCancel"
	>
		<div class="g-flex">
			<div class="g-1of2 g-br">
				<div class="g-tc _title g-c-black1">类别</div>
				<div class="_height" style="overflow-y: auto; margin-left: -16px">
					<div
						v-for="(item, i) in allCategory" 
						:key="i"
						:class="['_data', nowId === item.category_id ? '_active' : '']"
						style="cursor: pointer"
						@click="handleGetDetail(item.category_id)">分类{{ i }}：
						<span class="g-c-black2">{{ item.category_name }}</span>
					</div>
				</div>
			</div>
			<div class="g-1of2">
				<div class="g-tc _title g-c-black1">该分类下的活动</div>
				<div class="_ul"/>
				<div 
					v-if="nowLists.length" 
					class="_height"
					style="width: 300px; overflow-y: auto;"
				>
					<div 
						v-for="(item, i) in nowLists"
						:class="['_data', 'g-pd-l-30']"
						:key="i">{{ item.activity_name }}</div>
				</div>
				<div v-if="!nowLists.length">
					<div class="g-tc" style="width: 300px;margin-top: 150px">该分类下暂无活动页</div>
				</div>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-button': Button,
	},
	props: {
		category_id: {
			require: true,
			type: String
		}
	},
	data() {
		return {
			visible: false,
			nowId: '',
			cacheData: {},
			allCategory: []
		};
	},
	computed: {
		nowLists() {
			return this.cacheData[this.nowId] || [];
		}
	},
	async created() {
		// 获取所有分类
		this.handleGetAllCategory();

		// 获取当前选中的分类详情
		const response = await this.$request({
			url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_CATEGORY_GET,
			type: "GET",
			param: {
				id: this.category_id
			}
		});
		this.cacheData[this.category_id] = response.data.list;
		this.nowId = this.category_id;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		async handleGetDetail(category_id) {
			if (this.cacheData[category_id]) {
				this.nowId = category_id;
				return this.cacheData[category_id];
			}
			const res = await this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_CATEGORY_GET,
				type: "GET",
				param: {
					id: category_id
				}
			});
			this.cacheData[category_id] = res.data.list;
			this.nowId = category_id;
		},
		handleGetAllCategory() {
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_CATEGORY_GET,
				type: "GET",
			}).then(({ data }) => {
				this.allCategory = data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const PModalDetail = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-content-activity {
	._title {
		height: 50px;
		line-height: 50px; 
		font-size: 14px;
		margin-top: -16px;
	}
	._data {
		line-height: 40px;
		font-size: 14px;
		padding-left: 30px; 
	}
	._height {
		height: 300px;
	}
	._ul {
		height: 1px;
		width: 90%;
		margin-left: 5%;
		background: #d4d7db;
	}
	._data.g-pd-l-30:nth-child(2n) {
		background-color: #fafafa
	}
	._active {
		background-color: #f0f4fc;
	}
}

</style>

