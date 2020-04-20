<template>
	<div class="page">
		<i-drawer
			v-model="visible"
			class=" v-sale-main-notice-child-month-active-drawer"
			width="1100"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<p slot="header" style="line-height: 32px; height: 32px">
				<span style=" font-size: 16px; color: #000; font-weight: normal">更多活动</span>
			</p>
			<div class="_tabs">
				<i-tabs v-model="name" @on-click="handleTabChange" >
					<i-tabPane label="全部活动" name="1">
						<oa-active v-if="name==1"/>
					</i-tabPane>
					<i-tabPane label="报名记录" name="2">
						<oa-list v-if="name==2" :search="search" />
					</i-tabPane>
				</i-tabs>
			</div>
			<div slot="footer">
				<vc-debounce-click :tag="Button" type="text" @click="handleNull">取消</vc-debounce-click>
				<vc-debounce-click :tag="Button" type="error" @click="handleSave">保存</vc-debounce-click>
			</div>
		</i-drawer>
	</div>
</template>

<script type="text/ecmascript-6">
import { Drawer, Tabs, TabPane, Input, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import active from './active';
import list from './list';

export default {
	name: "v-more-active",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		"oa-active": active,
		"oa-list": list,
	},
	props: {
		data: Object
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			search: query.keyword || '',
			name: this.data.name ? '2' : '1',
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleTabChange() {
			this.search = '';
		},
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
    .v-sale-main-notice-child-month-active-drawer {
        .ivu-drawer-wrap .ivu-drawer-body {
                padding: 0 !important;
                height: auto;
			}
        ._tabs {
            .ivu-tabs-bar {
                margin-bottom: 20px !important ;
            }
            .ivu-tabs-nav {
                float: none !important;
                background: #f5f5f6;
            }
            .ivu-tabs-ink-bar {
                background: none !important;
            }
            .ivu-tabs-tab {
                color: #818794;
                margin-left: 20px;
                padding-left: 0;
                padding-right: 0;
            }
            .ivu-tabs-nav-scroll {
                border-bottom: 2px solid #d4d7db;
            }
            .ivu-drawer-header {
                border: none !important;
            }
            .ivu-tabs-tab-active {
                color: #d9444f !important;
                border-bottom: 2px solid #d9444f !important;
            }
        }
        }
</style>
