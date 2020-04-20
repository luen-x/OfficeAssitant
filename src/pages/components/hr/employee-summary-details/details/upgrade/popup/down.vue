<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="晋升文件"
		width="400px"
		@submit.native.prevent="handleOk"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div class="v-hr-employee-summary-details-upgrade-down">
			<i-checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
				<div v-for="(item,index) in cycleAttachArr" :key="index" class="g-fl">
					<div class="_content g-flex">
						<div>
							<i 
								v-if="item.type==='.doc'||item.type==='.docx'" 
								class="iconfont icon-word _pic" 
								style="color: #4b89f1"/>
							<i 
								v-if="item.type==='.xls'||item.type==='.xlsx'" 
								class="iconfont icon-xls _pic" 
								style="color: #4FC43D"/>
							<i 
								v-if="item.type==='.txt'" 
								class="iconfont icon-txt _pic" 
								style="color: #828291"/>
						</div>
						<i-checkbox :label="item.url">
							<i-tooltip 
								transfer 
								placement="bottom-start"
								style="margin: 10px auto;maxWidth:60px"
							>
								<div>
									{{ item.title.substr(0, 4) + '...' }}
								</div>
								<div slot="content">
									<p style="whiteSpace: normal">
										{{ item.title }}
									</p>
								</div>
							</i-tooltip>
						</i-checkbox>
					</div>
				</div>
			</i-checkbox-group>
		</div>
		<div style="border-top: 1px solid #e9e9e9;padding-top:6px;margin-top:6px;padding-left:50px">
			<i-checkbox
				:indeterminate="indeterminate"
				:value="checkAll"
				@click.prevent.native="handleCheckAll">全选</i-checkbox>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Checkbox, CheckboxGroup, Tooltip } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { downloadFile } from '@utils/download';
import Upload from '@components/_common/upload/upload';

export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal,
		"i-checkbox": Checkbox,
		"i-checkbox-group": CheckboxGroup,
		"i-tooltip": Tooltip,
		"oa-upload": Upload,
	},
	props: {
		cycle_attach_doc: Array,
	},
	data() {
		let allGroup = this.cycle_attach_doc.length 
			? this.cycle_attach_doc.map((item) => { return item.url; }) 
			: [];
		return {
			allGroup,
			visible: false,
			title: '',
			cycleAttachArr: this.cycle_attach_doc.length ? this.cycle_attach_doc : [],
			indeterminate: false,
			checkAll: false,
			checkAllGroup: allGroup
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.handleCheckAll();
	},
	methods: {
		handleOk() {
			if (this.checkAllGroup.length) {
				this.visible = false;
			}
			this.checkAllGroup.forEach(item => {
				downloadFile({
					fileName: item,
				});
			});
		},
		handleCancel() {
			this.visible = false;
		},
		handleCheckAll() {
			if (this.indeterminate) {
				this.checkAll = false;
			} else {
				this.checkAll = !this.checkAll;
			}
			this.indeterminate = false;
			if (this.checkAll) {
				this.checkAllGroup = this.allGroup;
			} else {
				this.checkAllGroup = [];
			}

		},
		checkAllGroupChange(data) {
			if (data.length === this.cycleAttachArr.length) {
				this.indeterminate = false;
				this.checkAll = true;
			} else if (data.length > 0) {
				this.indeterminate = true;
				this.checkAll = false;
			} else {
				this.indeterminate = false;
				this.checkAll = false;
			}
		}
	}
};

export const DownModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-employee-summary-details-upgrade-down{
	margin-left:50px;
	overflow: hidden;
	._pic{
		font-size:40px;
	}
	._content{
		flex-direction: column;
		width:100px;
	}
}
</style>
