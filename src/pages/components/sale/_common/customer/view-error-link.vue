<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="true"
		title="标记错误联系方式"
		footer-hide
		width="750"
		class="v-sale-customer-view-error-link"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="height:240px">
			<i-table 
				ref="table"
				:columns="columns"
				:data="tableData"
				:loading="loading"
				:height="tableHeight"
			/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Table } from 'iview';
import Explain from '@components/_common/explain/explain';
import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import { handleCopyPhone } from '@components/sale/call-manage/call/util';
import CusAudio from '@components/sale/_common/audio/audio';
import { debounce } from 'lodash';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: "oa-sale-view-error-link",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-table': Table
	},
	mixins: [orderModal],
	props: {
		linkId: [Number, String], // customer_id
	},
	data() {
		const columns = [
				
			{
				title: '标记人',
				minWidth: 80,
				fixed: 'left',
				key: 'staff_name',
			},
			{
				title: '标记时间',
				key: 'create_time',
				minWidth: 160,
			},
			{
				title: '录音凭证',
				key: 'tape_link',
				minWidth: 300,
				render: (h, { row }) => {
					return (
						row.tape_link ? <CusAudio src={row.tape_link} class="_audio-background" mode="mid" show-tip="never"/> : <span>--</span>
					);
				}
			},
			{
				title: '拨号备注',
				key: 'remark',
				minWidth: 200,
				render: (h, { row }) => {
					return (
						<AutoTooltip content={row.remark || '-'} theme="dark" placement="bottom" labelClass=" "/>
					);
				}
			}
			
		];
		if (this.$global.staff.is_charge) {
			columns.push({
				title: '操作',
				key: '-',
				fixed: 'right',
				width: 80,
				render: (h, { row }) => {
					return <span class="g-operation" onClick={() => this.handleDelete(row)}>删除</span>;

				}
			});
		}
		return {
			visible: false,
			loading: false,
			columns,
			tableData: [
				// {
				// 	 "relation_id": '', // 主键
				// 	"staff_id": '', // 员工id
				// 	"create_time": "", // 创建时间
				// 	"record_file": "", // 链接
				// 	"remark": "存在公海", // 备注
				// 	"staff_name": '', // 员工姓名
				// 	"tape_link": [] // 播放链接
				// }
			

			],
			
			
		};
	},
	computed: {
		tableHeight() {
			if (this.tableData.length > 6) {
				return 240;
			} else {
				return '';
			}

			
		}

	},
	created() {
		this.loadData();
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
			
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: "_SALE_CUSTOMER_LINK_TEL_LINK_RELATION_GET",
				type: "GET",
				param: {
					link_id: this.linkId
				},
				loading: false,
			}).then(res => {
				this.tableData = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDelete(row) {
			Confirm.popup({ msg: '确认删除此标记吗？', title: '删除提示' }).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_LINK_RELATTION_DELETE_POST",
					type: "POST",
					param: {
						relation_id: row.relation_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			}).catch(err => err && console.error(err));
		}
	}
};
export const ViewErrorLink = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-view-error-link {
	.v-sale-audio{
		._audio {
			background: inherit;
			padding: 0;
		}

	}
}

</style>

