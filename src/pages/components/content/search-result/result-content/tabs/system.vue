<template>
	<div v-show="showitem" class="g-fw-w v-content-search-result">
		<div class="_tip g-m-b-10" v-html="listInfo.result_str_top" />
		<oa-no-data v-if="!listInfo.data[1].length" />
		<div v-else class="_wrapper">
			<div class="_sysytem-methods-wrapper">
				<div v-for="(item, index) in listInfo.data[1] || []" :key="index" class="_item-wrapper" >
					<div class="_card-wrapper">
						<div class="_item-card" @click="handleToSys(item)">
							<i class="iconfont icon-product _item-icon"/>
							<div v-html="item.name" />
						</div>
					</div>
					<div class="__item-text" @click="handleToSys(item)">
						<span>点击进入</span><span v-html="item.parent_name" />
					</div>
				</div>
			</div>
			<div class="g-m-t-20" v-html="listInfo.result" />
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';
import item from './item';
import noData from './no-data';

export default {
	name: 'content-search-tabs-system',
	components: {
		'oa-no-data': noData,
		'i-tool-tip': Tooltip
	},
	mixins: [item],
	props: {
		showitem: Boolean,
	},
	data() {
		return {
			cardList: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo[2] || { data: {} };
		},
		keyword() {
			const { query = {} } = this.$route;
			return String(query.keyword || '');
		}
	},
	methods: {
		handleToSys(e) {
			this.$router.push({
				path: e.frontend_url,
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.v-content-search-result {
	._tip {
		color: #000;
		font-size: 14px;
		padding-left: 120px;
	}
	._wrapper {
		padding-left: 120px;
		._sysytem-methods-wrapper {
			margin-top: 20px;
			margin-bottom: 20px;
			width: 60%;
			min-width: 575px;
			display: flex;
			align-items: flex-start;
			flex-wrap: wrap;
			._item-wrapper {
				display: inline-block;
				text-align: center;
				margin: 20px 40px 0 0;
				min-width: 150px;
				max-width: 150px;
				._card-wrapper {
					display:flex;
					justify-content:center;
					._item-card {
						align-self: center;
						min-width: 130px;
						max-width: 130px;
						margin-bottom: 10px;
						padding: 7px 20px 8px 20px;
						border: 1px solid #efefef;
						border-radius: 5px;
						box-shadow:0px 0px  2px 1px #efefef;
						cursor: pointer;
						._item-icon {
							font-size: 26px;
						}
					}
				}
			}
			.__item-text {
				cursor: pointer;
			}
		}
	}
}
</style>


