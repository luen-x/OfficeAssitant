<template>
	<div class="v-content-search-content">
		<div class="_header">
			<div class="__logo">
				<img :src="OSS_SEARCH_LOGO" style="cursor: pointer;" @click="handleToHome()">
			</div>
			<div class="__search">
				<i-input v-model="keyword" class="__input" @on-enter="handleSearch()">
					<vc-debounce-click 
						slot="suffix" 
						class="__search-button" 
						@click="handleSearch()"
					>
						<i-divider type="vertical" />
						搜索
					</vc-debounce-click>
				</i-input>
			</div>
			<i class="iconfont icon-close __close" @click="handleBack()"/>
		</div>
		<oa-search-result ref="search" :keyword="keyword" style="width: 100%;"/>
		
	</div>
</template>

<script>
import { OSS_SEARCH_LOGO } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Input, Message, Divider } from 'iview';
import ResultContent from './result-content/result-content';

export default {
	name: 'oa-tpl',
	components: {
		'i-input': Input,
		'oa-search-result': ResultContent,
		'i-divider': Divider
	},
	data() {
		return {
			keyword: '',
			OSS_SEARCH_LOGO,
		};
	},
	created() {
		if (this.$route.query.keyword) {
			this.keyword = this.$route.query.keyword;
		}
	},
	methods: {
		handleBack() {
			this.$router.go(-2);
		},
		handleToHome() {
			this.$router.go(-1);
		},
		handleSearch(event) {
			let key = this.keyword.replace(/^\s+|\s+$/gm, '');
			if (key) {
				this.$router.replace(getHashUrl(
					'/content/search/result', 
					{ 
						...this.$route.query, 
						keyword: key,
					}
				));
				this.$refs.search.loadData();
				return;
			}
			this.$Message.warning('请输入搜索关键字');
		},
	},
};
</script>

<style lang="scss">
.v-content-search-content {
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background: #e84854;
	}
	._header {
		height: 70px;
		min-width: 1000px;
	    line-height: 70px;
	    padding-left: 26px;
	    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
		background-color: #f5f5f6;
		.__logo {
			display: inline-block;
			width: 90px;
			height: 60px;
		}
		.__search {
			display: inline-block;
			font-size: 14px;
			.__input {
				width: 600px;
				height: 45px;
				.__search-button {
					height: 42px;
					line-height: 42px;
					cursor: pointer;
					color: #2e9dfa;
				}
			}
		}
		.__close {
			float: right;
			cursor: pointer;
			margin-right: 30px;
			font-size: 20px;
		}
	}
	.ivu-input {
		height: 40px;
	}
	.ivu-input-suffix {
		width: 90px;
	}
	.ivu-tabs-nav-scroll {
		background-color: #f5f5f6;
		padding-left: 120px;
	}
}
</style>
