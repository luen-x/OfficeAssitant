<template>
	<div class="v-hr-employee-relation-try-invoice g-m-t-20 g-m-lr-20">

		<i-tab
			v-model="type"
			:animated="false"
			type="card"
			@on-click="handleChange">

			<i-tab-pane
				v-for="item in tabList"
				:key="item.value"
				:label="item.label"
				:name="item.value">
				<span class="_title g-flex-ac g-m-b-20">上传图片</span>
				<oa-upload
					v-model="file"
					:max="6"
					:upload="{accept: '.pdf, .png, .jpg, .jpeg, .gif'}"
					@change="handleFileChange"
				/>
				<span class="_title g-flex-ac g-m-tb-20">在线单据</span>
				<div v-if="is_apply && item.value === '1'" class="_apply">
					<vc-print ref="applyTarget">
						<oa-print-regular-apply :info="applyInfo" />
					</vc-print>
				</div>
				<div v-if="is_interview && item.value === '2'" class="_talk">
					<vc-print ref="talkTarget">
						<oa-print-regular-talk :info="talkInfo" />
					</vc-print>
				</div>
				<div
					v-if="(!is_apply && item.value === '1') || (!is_interview && item.value === '2')"
					class="_no-data g-flex g-fd-c g-jc-c g-ai-c">
					<img :src="nodataUrl" class="g-m-b-20">
					<span>目前还没有数据哦</span>
				</div>
			</i-tab-pane>
		</i-tab>

		<div v-if="show && !is_person" class="_footer g-flex-cc">
			<vc-debounce-click class="g-red-btn-small" @click="handlePrint">打印</vc-debounce-click>
		</div>

	</div>
</template>

<script>
import { Print } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { Breadcrumb, BreadcrumbItem, Tabs, TabPane } from 'iview';
import Upload from '@components/_common/upload/upload';
import PrintRegularApply from '../form/print/regular-apply';
import PrintRegularTalk from '../form/print/regular-talk';

export default {
	name: 'oa-tpl',
	components: {
		'i-breadcrumb': Breadcrumb,
		'i-breadcrumb-item': BreadcrumbItem,
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		'vc-print': Print,
		'oa-print-regular-apply': PrintRegularApply,
		'oa-print-regular-talk': PrintRegularTalk,
		"oa-upload": Upload
	},
	data() {
		const { query = {} } = this.$route;
		return {
			applyInfo: {},
			talkInfo: {},
			is_apply: '',
			is_interview: '',
			// apply_id: '',
			// talk_id: '',
			type: String(query.type || '1'),
			fileInfo: [],
			file: [],
			oldFile: [],
			nodataUrl: OSS_INVOICE_EMPTY,
			is_person: !!query.from,
			tabList: [
				{ label: '转正申请', value: '1' },
				{ label: '转正面谈', value: '2' }
			]
		};
	},
	computed: {
		show() {
			if (this.type === '1') {
				return this.is_apply === 1;
			} else {
				return this.is_interview === 1;
			}
		}
	},
	created() {
		this.is_apply = +this.$route.query.is_apply;
		this.is_interview = +this.$route.query.is_interview;
		this.loadTab();
		this.loadFile();
	},
	methods: {
		handleChange(val) {
			this.loadFile();
			this.loadApplyInfo();
		},
		handlePrint() {
			this.type === '1' ? this.$refs.applyTarget[0].print() : this.$refs.talkTarget[0].print();
		},
		// 获取附件
		loadFile() {
			this.$request({
				url: API_ROOT['_HR_EMPLOYEE_RELATION_INVOICE_FILE_POST'],
				type: "POST",
				param: {
					staff_id: this.$route.query.staff_id,
					scenario: 3,
					type: this.type === '1' ? 2 : 1
				},
				loading: false
			}).then((res) => {
				this.fileInfo = Array.isArray(res.data) ? res.data : [];
				this.oldFile = [];
				if (this.fileInfo.length) {
					this.file = this.fileInfo.map(item => item.url).filter((i) => i.url);
					this.file.forEach(item => {
						this.oldFile.push({ ...item });
					});
				} else {
					this.file = [];
					this.oldFile = [];
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadTab() {
			// 获取单据tab
			// this.$request({
			// 	url: API_ROOT['_HR_EMPLOYEE_RELATION_INVOICE_TAB_GET'],
			// 	type: "POST",
			// 	param: {
			// 		relation_id: this.$route.query.staff_id,
			// 		scenario: 3,
			// 		regular_fail_id: this.$route.query.regular_fail_id
			// 	},
			// 	loading: false
			// }).then((res) => {
			// 	if (res.data.length) {
			// 		res.data.forEach(item => {
			// 			item.type === 1 ? this.talk_id = item.staff_template_id : this.apply_id = item.staff_template_id;
			// 		});
			this.loadApplyInfo();
			this.loadTalkInfo();
			// 	}
			// }).catch((error) => {
			// 	this.$Message.error(error.msg);
			// });
		},
		loadApplyInfo() {
			if (this.is_apply === 1 || this.is_interview === 1) { 	//  && this.apply_id
				// 申请单
				this.$request({
					url: API_ROOT['_HR_FORM_REGULAR_APPLY_GET'],
					type: "POST",
					param: {
						// staff_template_id: this.apply_id,
						scenario: 3,
						relation_id: this.$route.query.staff_id,
						staff_id: this.$route.query.staff_id,
						template_id: this.type === '1' ? this.$route.query.template_id : this.$route.query.interview_template_id,
						type: this.type === '1' ? 2 : 1,
						entrance_type: 0
					},
					loading: false
				}).then((res) => {
					this.applyInfo = {
						...res.data
					};
					this.talkInfo = {
						...this.talkInfo,
						...res.data
					};
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
		},
		loadTalkInfo() {
			// if (this.is_interview === 1) { 	//  && this.talk_id
			// 	// 面谈单
			// 	this.$request({
			// 		url: API_ROOT['_HR_FORM_REGULAR_TALK_GET'],
			// 		type: "POST",
			// 		param: {
			// 			// staff_template_id: this.talk_id,
			// 			scenario: 3,
			// 			relation_id: this.$route.query.staff_id,
			// 			staff_id: this.$route.query.staff_id,
			// 			template_id: this.$route.query.interview_template_id,
			// 			type: this.type === '1' ? 2 : 1,
			// 			entrance_type: 0
			// 		},
			// 		loading: false
			// 	}).then((res) => {
			// 		this.talkInfo = {
			// 			...this.talkInfo,
			// 			...res.data
			// 		};
			// 	}).catch((error) => {
			// 		this.$Message.error(error.msg);
			// 	});
			// }
		},
		handleFileChange(val) {
			// 保存附件 减少
			if (this.file.length < this.oldFile.length) {
				let item = this.oldFile.filter(it => {
					return this.file.findIndex(file => file.uid === it.uid) === -1;
				})[0];
				let id = this.fileInfo[this.oldFile.indexOf(item)].invoices_url_id;
				this.$request({
					url: API_ROOT['_HR_EMPLOYEE_INVOICE_FILE_DELETE_POST'],
					type: "POST",
					param: {
						invoices_url_id: id
					},
					loading: false
				}).then((res) => {
					this.$Message.success(res.msg);
					this.loadFile();
				}).catch((error) => {
					this.$Message.error(error.msg);
					this.loadFile();
				});
			} else {	// 保存附件 新增
				let item = this.file.filter(it => {
					return this.oldFile.findIndex(file => file.uid === it.uid) === -1;
				})[0];
				this.$request({
					url: API_ROOT['_HR_EMPLOYEE_INVOICE_FILE_SAVE_POST'],
					type: "POST",
					param: {
						staff_id: this.$route.query.staff_id,
						scenario: 3,
						type: this.type === '1' ? 2 : 1,
						url: item
					},
					loading: false
				}).then((res) => {
					this.$Message.success(res.msg);
					this.loadFile();
				}).catch((error) => {
					this.$Message.error(error.msg);
					this.loadFile();
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-employee-relation-try-invoice {
	._apply, ._talk {
		// width: 90%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50px;
	}
	._no-data {
		height: calc(100vh - 392px);
	}
	._title {
		color: #333;
		font-size: 14px;
	}
	._title:before {
		content: '';
		display: inline-block;
		width: 2px;
		height: 14px;
		margin-right: 10px;
		background: #e84854;
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
