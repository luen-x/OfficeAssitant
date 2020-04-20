
<template>
	<div class="v-sale-notice">
		<div class="_title g-tc g-c-black1">公告栏</div>
		<div class="_tabs">
			<i-tabs v-model="type" class="g-tc">
				<i-tabPane label="近期活动" name="1" style="position: relative;">
					<oa-month-active />
				</i-tabPane>
				<i-tabPane label="最新资讯" name="2" style="position: relative;">
					<oa-information />
				</i-tabPane>
				<i-tabPane label="在售商品" name="3" style="position: relative;">
					<oa-sell-goods />
				</i-tabPane>
				<i-tabPane label="讲师课表" name="4" style="position: relative;">
					<oa-lecturer-List/>
				</i-tabPane>
			</i-tabs>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { Tabs, TabPane } from 'iview';
import month from './child/month-active';
import information from './child/information';
import sell from './child/sell-goods';
import lecturerList from '../lecturer/lecturer-list';

export default {
	components: {
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"oa-month-active": month,
		"oa-information": information,
		"oa-sell-goods": sell,
		"oa-lecturer-List": lecturerList,

	},
	data() {
		return {
			type: '1',
		};

	}
};
</script>

<style scoped lang="scss">
	.v-sale-notice {
	   //  display: inline-block;
	    height: 370px;
	    background-color: rgba(0, 0, 0, 0);
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
	    ._title {
	        height: 46px;
	        line-height: 46px;
	        font-size: 14px;
	        background: #f8f8f8;
	    }
	    ._tabs {
	        /deep/ .ivu-tabs-nav {
	            float: none !important;
	        }
	        /deep/ .ivu-tabs-ink-bar {
	            background: none !important;
	        }
	        /deep/ .ivu-tabs-tab {
				padding: 10px 0;
	            background: none !important;
				margin: 0 20px !important;
				min-width: auto;
	        }
	        /deep/ .ivu-tabs-tab-active {
	            border-bottom: 3px solid #d9444f !important;
	        }

	    }
	}
</style>
