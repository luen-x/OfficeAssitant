<template>
	<div class="v-sale-quality-check-record g-pd-10">
		<div class="g-flex g-lh-30">
			<div class="g-m-r-30">
				<span class="g-c-black3">回款金额：</span>
				<span class="g-c-black3">
					{{ current.return_money || '--' }}
				</span>
			</div>
			<div class="g-m-r-30">
				<span class="g-c-black3">代理人数：</span>
				<span class="g-c-black3">
					{{ current.agent_num || '--' }}
				</span>
			</div>
			<span 
				v-if="current.is_sale_follow === 1 && !fromOther" 
				class="g-c-blue-mid g-pointer"
				@click="handleAdd"
			>
				添加跟进情况
			</span>
		</div>
		<div class="g-flex g-lh-30">
			<div class="g-m-r-30">
				<span class="g-c-black3">是否启动招商会：</span>
				<span class="g-c-black3">
					{{ ['是','否','不知道'][+current.attract_meet - 1] || '--' }}
				</span>
			</div>
			<div class="g-m-r-30">
				<span class="g-c-black3">是否启动内训：</span>
				<span class="g-c-black3">
					{{ ['是','否','不知道'][+current.inner_training - 1] || '--' }}
				</span>
			</div>
			<div class="g-m-r-30">
				<span class="g-c-black3">销售是否同步跟进：</span>
				<span class="g-c-black3">
					{{ ['否','是'][+current.is_sale_follow] || '--' }}
				</span>
			</div>
		</div>
		<div 
			class="g-m-t-5" 
			style="word-break: break-all;"
		>
			<span class="g-c-black3">备注：</span>
			<span class="g-c-black3">{{ current.memo || '--' }}</span>
		</div>
		<div class="g-flex g-m-t-10">
			<span class="g-c-black3">回访凭证：</span>
			<oa-upload
				:max="6"
				:data-source="current.fileImage.map(it => ({
					type: it.img_url.substr(it.img_url.lastIndexOf('.')),
					url: it.img_url
				}))"
				disabled
				@preview-start="handlePreviewStart"
				@preview-end="handlePreviewEnd"
			>
				<span slot="trigger"/>
			</oa-upload>
		</div>
		<div v-if="current.is_follow === 2" class="g-flex g-lh-30">
			<div class="g-m-r-30">
				<span class="g-c-black3">解决时间：</span>
				<span class="g-c-black3">{{ current.resolve_time }}</span>
			</div>
			<div class="g-m-r-30">
				<span class="g-c-black3">解决备注：</span>
				<span v-if="current.resolve_mark">
					<i-tooltip
						v-if="current.resolve_mark.length > 15"
						:content="current.resolve_mark" 
						:max-width="300"
						transfer
						placement="bottom-start"
					>
						<span class="g-c-black3">{{ current.resolve_mark.substr(0, 15) + '...' }}</span>
					</i-tooltip>
					<span v-else class="g-c-black3">{{ current.resolve_mark }}</span>
				</span>
				<span v-else class="g-c-black3">--</span>
			</div>
			<div class="g-m-r-30">
				<span class="g-c-black3">操作人：</span>
				<span class="g-c-black3">{{ current.resolve_staff_name }}</span>
			</div>
		</div>
		<div 
			v-for="(item, index) in current.follow"
			:key="index"
			class="g-pd-tb-10 _item"
		>
			<div class="g-pd-10" style="background-color: #f6f6f6;">
				<div class="g-flex g-jc-sb">
					<div style="width: 500px;word-break: break-all;">
						<span class="g-c-black3">跟进情况：</span>
						<span class="g-c-black3">{{ item.mark || '--' }}</span>
					</div>
					<div 
						v-if="current.follow_status === 1 && !fromOther" 
						class="g-c-blue-mid"
					>
						<span 
							class="g-pointer" 
							@click="handleEdit(item)"
						>
							重新编辑
						</span>
						<span class="g-pd-lr-10">|</span>
						<span 
							class="g-pointer" 
							@click="handleReset(item.follow_id)"
						>
							撤回
						</span>
					</div>
				</div>
				<div class="g-flex g-m-t-10">
					<span class="g-c-black3">跟进凭证：</span>
					<oa-upload
						:max="6"
						:data-source="item.fileImage.map(it => ({
							type: it.img_url.substr(it.img_url.lastIndexOf('.')),
							url: it.img_url
						}))"
						disabled
						@preview-start="handlePreviewStart"
						@preview-end="handlePreviewEnd"
					>
						<span slot="trigger"/>
					</oa-upload>
				</div>
				<div class="g-flex g-jc-fe">
					<div>
						<span class="g-c-black3">回复人：</span>
						<span class="g-c-black3">{{ item.follow_staff_name || '--' }}</span>
					</div>
					<span class="g-pd-lr-10 g-c-black3">|</span>
					<div>
						<span class="g-c-black3">回复时间：</span>
						<span class="g-c-black3">{{ item.create_time || '--' }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, Tooltip } from 'iview';
import { Confirm } from '@components/_common/confirm/confirm';
import Upload from '@components/_common/upload/upload';
import { ServiceQualityCheckEdit } from './check-edit';

export default {
	name: 'oa-quality-check-record',
	components: {
		'i-button': Button,
		'i-tooltip': Tooltip,
		"oa-upload": Upload,
	},
	props: {
		current: {
			type: Object,
			default() {
				return {};
			}
		},
		fromOther: Boolean
	},
	data() {
		return {};
	},
	methods: {
		/**
		 * 添加跟进
		 */
		handleAdd() {
			ServiceQualityCheckEdit.popup({
				qualityRecordId: this.current.quality_record_id,
				title: '添加跟进情况'
			}).then(() => {
				this.$emit('reload');
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 编辑跟进
		 */
		handleEdit(item) {
			ServiceQualityCheckEdit.popup({
				title: '编辑跟进情况',
				followId: item.follow_id,
				qualityRecordId: this.current.quality_record_id,
				mark: item.mark,
				fileImage: item.fileImage.map((it, uid) => ({
					uid,
					title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
					type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
					url: it.img_url 
				}))
			}).then(() => {
				this.$emit('reload');
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 撤回
		 */
		handleReset(follow_id) {
			Confirm.popup({
				title: '撤回',
				msg: '确认撤回该条跟进记录？'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_CANCEL_FOLLOW_POST',
					type: 'POST',
					loading: false,
					param: {
						follow_id
					},
					autoTip: true
				}).then(res => {
					this.$emit('reload');
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceQualityCheckRecord = module.exports.default;
</script>

<style lang="scss">
	.v-sale-quality-check-record {
		background-color: #fff;
		._item {
			background-color: #fff;
		}
		.c-upload ._item {
			margin: 0 10px 0 0;
		}
	}
</style>

