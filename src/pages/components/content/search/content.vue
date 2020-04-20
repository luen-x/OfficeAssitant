<template>
	<div class="v-content-search">
		<div class="v-content-search-title">
			<span class="g-operation g-pd-r-5" @click="goBack()">返回</span>
			<span class="g-pd-l-5 _text">全局搜索</span>
			<i class="iconfont icon-close _close" @click="goBack()"/>
		</div>
		<div class="v-content-search-wrapper g-flex-ac">
			<div class="_logo">
				<img :src="OSS_SEARCH_LOGO">
			</div>
			<div class="_search">
				<i-input v-model="keyword" class="_input" @on-enter="handleSearch()">
					<span slot="suffix" class="_search-button" @click="handleSearch()">搜索</span>
				</i-input>
			</div>
			<i-row v-if="recommendList.length" class="_recommend">
				<i-col span="3 _left-text">推荐搜索：</i-col>
				<i-col span="21" style="height: 130px;overflow: hidden;">
					<div 
						v-for="(item, index) in recommendList"
						:key="index" 
						class="_item" 
						@click="handleSelect(item)"
					>
						<span v-if="item.keyword.length < 9">{{ item.keyword }}</span>
						<span v-else>{{ item.keyword.substring(0, 9) }}...</span>
					</div>
				</i-col>
			</i-row>
			<i-row v-if="historyList.length" class="_history">
				<i-col span="3 _left-text">历史搜索：</i-col>
				<i-col span="21" style="height: 130px;overflow: hidden;">
					<div 
						v-for="(item, index) in historyList" 
						:key="index" 
						class="_item" 
						@click="handleSelect(item)"
					>
						<span v-if="item.keyword.length < 9">{{ item.keyword }}</span>
						<span v-else>{{ item.keyword.substring(0, 9) }}...</span>
					</div>
				</i-col>
			</i-row>
		</div>
	</div>
</template>

<script>
import { OSS_SEARCH_LOGO } from '@constants/constants';
import { getItem, setItem, delItem, getIndexRoute, goBack } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { Input, Row, Col, Message } from 'iview';

export default {
	name: 'oa-tpl',
	components: {
		'i-input': Input,
		'i-row': Row,
		'i-col': Col,
	},
	data() {
		return {
			keyword: '',
			recommendList: [],
			historyList: [],
			OSS_SEARCH_LOGO
		};
	},
	created() {
		this.getRecommendList();
		this.getHistoryList();
	},
	methods: {
		getRecommendList() {
			this.$request({
				url: API_ROOT._CONTENT_SEARCH_RECOMMEND_LIST_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.recommendList = res.data;
			}).catch(error => {
			});
		},
		getHistoryList() {
			this.$request({
				url: API_ROOT._CONTENT_SEARCH_HISTORY_LIST_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.historyList = res.data;
			}).catch(error => {
			});
		},
		handleSearch() {
			let key = this.keyword.replace(/^\s+|\s+$/gm, '');
			if (key) {
				this.$router.push({
					path: '/content/search/result',
					query: {
						type: 1,
						keyword: key
					}
				});
				return;
			}
			this.$Message.warning('请输入搜索关键字');
		},
		handleSelect(item) {
			this.$router.push({
				path: '/content/search/result',
				query: {
					type: 1,
					keyword: item.keyword
				}
			});
			return;
		},
		goBack() {
			const closePath = getItem('closePath_' + _global.version);
			goBack(closePath);
			// 	closePath ? this.$router.push(closePath) : this.$router.back();
			// const curPathArr = fullPaths[0].split('/');
			// const diffrentPathIndex = fullPaths.findIndex(path => {
			// 	return !path.startsWith('/' + curPathArr[1] + '/' + curPathArr[2]);
			// });
			// if (diffrentPathIndex > -1) {
			// 	const diffrentPath = fullPaths[diffrentPathIndex];
			// 	fullPaths.splice(0, diffrentPathIndex + 1);
			// 	setItem('history_' + _global.version, fullPaths);
			// 	this.$router.push(diffrentPath);
			// } else {
			// 	this.$router.back();
			// }
		
			// this.$router.go(-1);
		}
	},
};
</script>

<style lang="scss">
.v-content-search {
	&-title {
		height: 44px;
	    line-height: 40px;
	    padding-left: 40px;
	    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
		background-color: #fff;
		._text {
			border-left: 1px solid #d5d8da;
		}
		._close {
			float: right;
			cursor: pointer;
			margin-right: 30px;
			padding-top: 4px;
			font-size: 20px;
		}
	}
	&-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		._logo {
			width: 93px;
			height: 43px;
			margin-top: 200px;
			@media screen and (max-height: 768px) {
				margin-top: 100px;
			}
		}
		._search {
			margin: 20px 0 20px 0;
			font-size: 14px;
			._input {
				width: 600px;
				height: 45px;
				._search-button {
					height: 45px;
					line-height: 45px;
					padding-left: 20px;
					cursor: pointer;
					color: #2e9dfa;
					border-left: 1px solid #c6c6c6;
				}
			}
		}
		._recommend {
			width: 600px;
			margin-bottom: 20px;
		}
		._history {
			width: 600px;
		}
		._left-text {
			color: #808790;
			height: 34px;
			line-height: 34px;
		}
		._item {
			display: inline-block;
			padding: 8px 15px 8px 15px;
			margin: 0 10px 10px 0;
			background-color: #f3f3f3;
			border-radius: 3px;
			cursor: pointer;
		}
	}
	.ivu-input {
		height: 45px;
	}
	.ivu-input-suffix {
		width: 90px;
	}
}
</style>
