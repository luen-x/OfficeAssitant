<template>
	<component :is="tag" class="vcp-imgs-picker">
		<vc-sort-list 
			v-model="data"
			:mask="false"
			primary-key="uid"
			@change="handleSortResult"
		>
			<div 
				slot-scope="it"
				:class="it.retcode == 0 && '__error'"
				class="__item  __normal"
			>
				<div
					v-if="it.src"
					:style="{backgroundImage: `url(${it.src})`}"
					class="__img"
				> 
					<div class="__mask g-relative">
						<div v-if="!$slots.operate && !$scopedSlots.operate">
							<vc-icon v-if="!disabled" type="delete" @click="handleDel(it)" />
							<vc-icon v-if="!disabled" type="divider" />
							<vc-icon type="preview" @click="handlePreview($event, it)" />
						</div>
						<div v-else>
							<slot v-bind="{src: it, index}" name="operate" />
						</div>
					</div>
				</div>


				<div v-else class="__img __flex-cc">
					<div v-if="it.percent && it.percent != 100" class="__pc-bg">
						<div :style="{width: it.percent + '%'}" class="__progress"/>
					</div>
					<p v-else-if="!it.url && it.percent == 100" class="g-pd-10" style="line-height: 1">
						服务器正在接收...
					</p>
					<div v-else-if="it.retcode == 0" class="g-pd-10 __flex-cc">
						上传失败
						<div class="__mask g-relative">
							<div>
								<vc-icon type="delete" @click="handleDel(it)" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</vc-sort-list>
		<vc-upload 
			v-show="!disabled && (dataSource.length < max || max === 0)"
			v-bind="upload"
			:accept="accept"
			class="__upload __normal"
			@file-start="handleFileStart"
			@file-progress="handleFileProgress"
			@file-success="handleFileSuccess"
			@file-error="handleFileError"
			@error="handleSelectError"
		/>
	</component>
</template>

<script>
import { Upload, ImgsPreview, Icon, SortList } from 'wya-vc';

export default {
	name: "vc-tpl",
	components: {
		'vc-upload': Upload,
		'vc-icon': Icon,
		'vc-sort-list': SortList
	},
	model: {
		prop: 'dataSource',
		event: 'change'
	},
	props: {
		tag: {
			type: String,
			default: 'div'
		},
		dataSource: {
			type: Array,
			default() {
				return [];
			},
		},
		max: {
			type: Number,
			default: 0
		},
		disabled: {
			type: Boolean,
			default: false
		},
		upload: {
			type: Object,
			default() {
				return {};
			}
		},
		accept: {
			type: String,
			default: 'image/gif,image/jpeg,image/jpg,image/png' // 不默认为image/*是因为在Webkit浏览器下回响应很慢
		}
	},
	data() {
		return {
			data: this.dataSource,
		};
	},
	watch: {
		dataSource(val) {
			this.setData(val);
		}
	},
	created() {
	},
	methods: {
		setData(dataSource) {
			if (dataSource === this.data) return;
			
			this.data = dataSource;
			this.dispatch('FormItem', 'on-form-change', dataSource);
		},
		handleFileStart(res) {
			this.data.push(res);
		},
		handleFileProgress(e, file) {
			if (parseInt(e.percent, 10) <= 100) {
				this.data = this.data.map((item) => {
					if (file.uid === item.uid) {
						return {
							...item,
							percent: e.percent
						};
					}
					return item;
				});
			}
		},
		handleFileSuccess(res, file) {
			let { data, format, max } = this;
			let dataSource;
			dataSource = data.map((item) => {
				if (item.uid === file.uid) {
					return format ? format(res) : res.data.url;
				}
				return item;
			});
			if (dataSource.length > max) {
				dataSource = dataSource.slice(0, max);
				this.$Message.warning('最多只能传6张哦~');
			}
			this.$emit('change', dataSource);
		},
		handleFileError(res, file) {
			// 内部保存上传失败的文件，不传递给外层
			let { data, max, format } = this;
			this.data = data.filter((item) => {
				if (item.uid === file.uid) {
					return {
						...item,
						...res,
						error_time: new Date().getTime()
					};
				}
				return item;
			});
			this.$emit('error', res);
		},
		handleDel(item) {
			let { data, max, format } = this;
			if (max !== 0 && data.length > max) {
				this.$emit('error', {
					status: 0,
					msg: '超出上传限制'
				});
				return;
			}
			let dataSource = data.filter(_item => _item != item.src);
			this.$emit('change', dataSource);
		},
		handlePreview(e, it) {
			let pos = {};
			try {
				const target = e.target; // 先得到pos, 否则getThumbBoundsFn再计划，target已变化
				const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				const rect = target.getBoundingClientRect();

				pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

			} catch (err) {
				console.error(err);
			}
			const idx = this.dataSource.findIndex(src => src == it.src);
			ImgsPreview.popup({
				visible: true,
				dataSource: this.dataSource,
				opts: {
					index: idx,
					history: false,
					getThumbBoundsFn: (index) => pos
				}
			}).then(() => {

			}).catch(() => {

			});
		},
		handleSelectError(err) {
			this.$emit('error', {
				msg: err.msg
			});
		},
		handleSortResult(newValue) {
			this.$emit('change', newValue);
		}
	}
};
</script>

<style lang="scss" scoped>
.vcp-imgs-picker {
	display: flex;
	box-sizing: border-box;
	flex-wrap: wrap;
	.__normal {
		width: 70px;
		height: 70px;
		border-radius: 0px;
		background-color: #fafafa;
		.__img {
			width: 70px;
			height: 70px;
			// margin: -10px;
		}
	}
	.__img {
		background-size: cover;
		position: relative;
	}
	.__item {
		box-sizing: border-box;
		margin: -10px;
		margin-right: 0px;
		// margin-bottom: 8px;
		cursor: pointer;
		padding: 8px;
	}
	.__item:hover .__mask {
		transition: opacity 0.5s;
		opacity: 1;
	}
	.__flex-cc {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.__pc-bg {
		flex: 1;
		background-color: #cdcdcd;
		height: 8px;
		border-radius: 5px;
		overflow: hidden;
		margin: 0 4px;
		.__progress {
			display: block;
			margin: 0;
			background-color: #2397fa;
			height: 8px;
			border-radius: 5px;
		}
	}
	.__error {
		color: #f42626;
		border: 1px solid #f42626;
	}
	.__mask {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;
		& > span {
			cursor: pointer;
			font-size: 18px;
		}
	}
	.__upload {
		display: flex;
		box-sizing: border-box;
		justify-content: center;
		align-items: center;
		position: relative;
		border: 1px dashed #d9d9d9;
		background-color: #fafafa;
		margin-right: 8px;
		margin-bottom: 8px;
		&:hover {
			border-color: #1890ff;
		}
		&:after,
		&:before {
			content: " ";
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			background-color: #999;
			border-radius: 2px;
		}
		&:before {
			width: 2px;
			height: 28px;
		}
		&:after {
			width: 28px;
			height: 2px;
		}
	}
}
</style>
