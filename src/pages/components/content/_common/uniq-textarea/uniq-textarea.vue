<template>
	<div class="v-uniq-textarea">
		<i-input
			ref="input"
			:value="textvalue"
			:maxlength="max"
			:placeholder="placeholder"
			:disabled="disabled"
			:autosize="autosize"
			type="textarea"
			@on-keyup="handleKeyUp"
		/>
		<div :style="{ height: height + 'px'}" class="_text-hidden" v-html="html"/>
		<transition name="fade">
			<div v-show="visible && inputVisible" class="_poper_container">
				<div v-if="spin">
					<oa-scroll :load-data="loadMore">
						<p 
							v-for="item of list" 
							:key="item.staff_id" 
							:value="`${item.staff_name} `"
							class="_item"
							@click="handleClick"
						>{{ item.staff_name }}</p>
					</oa-scroll>
				</div>
				<div v-else class="_spin">
					<i-spin fix/>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { Input, Spin } from 'iview';
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';
import Scroll from './scroll';

export default {
	name: 'uniq-textarea',
	components: {
		'i-input': Input,
		'i-spin': Spin,
		'oa-scroll': Scroll
	},
	props: {
		max: {
			type: Number,
			default: 200
		},
		placeholder: {
			type: String,
			default: "请输入备注信息"
		},
		// width: {
		// 	type: String,
		// 	default: "300px"
		// },
		disabled: Boolean,
		autosize: {
			type: Object,
			default: () => {
				return { minRows: 4, maxRows: 10 };
			}
		},
	},
	data() {
		return {
			visible: false,
			inputVisible: true,
			textvalue: '',
			height: 0,
			html: "",
			dropdown: null,
			index: 0,
			name: '',
			currentPage: 0,
			totalPage: 1,
			list: [],
			spin: true
		};
	},
	methods: {
		handleKeyUp(e) {
			const height = e.target.offsetHeight;
			const val = e.target.value;
			this.textvalue = val;
			this.$emit('input', this.textvalue);
			let visible;
			let top;
			let left;
			if (this.height !== height) {
				this.height = height;
			}
			if (val[val.length - 1] === '@') {
				this.visible = true;
				this.index = val.length - 1;
				this.html = val.substr(0, val.length - 1) + '<span class="_position-span">@</span>';
			}
			if ((val[val.length - 1] !== '@' && val.length - 1 < this.index) || val.length === 0) {
				this.visible = false;
				this.list = [];
			}
			if (this.visible) {
				const name = val.substr(this.index + 1, val.length);
				this.name = name;
				name.length < 10 && this.loadData(name);
			}
			this.$nextTick(() => {
				const position = document.querySelector('._position-span');
				const drop = document.querySelector('._poper_container');
				if (position) {
					top = this.getOffsetTop(position);
					left = this.getOffsetLeft(position);
					drop.style.top = top + 20 + "px";
					drop.style.left = left + 20 + "px";
				}
			});
		},
		loadData: debounce(function (staff_name) {
			this.spin = false;
			this.$request({
				url: API_ROOT._HR_STAFF_LIST_GET,
				type: 'GET',
				param: { staff_name },
				loading: false
			}).then(res => {
				const { list, currentPage, totalPage } = res.data;
				if (list.length === 0) {
					this.inputVisible = false;
					this.list = [];
				} else {
					this.inputVisible = true;

					// 修改
					list.forEach(v => {
						let values = v.staff_name.split(this.name);
						v.html = values.join('<span style="color: #d9444f;">' + this.name + '</span>');
					});

					this.list = list.slice(0, 10);
					this.currentPage = currentPage;
					this.totalPage = totalPage;
					this.spin = true;
				}
			}).catch(err => {
				this.$Message(err.msg);
				this.spin = true;
			});
		}, 300),
		loadMore: debounce(function () {
			// 修改
			if (this.list.length > 10) return;
			
			this.$request({
				url: API_ROOT._HR_STAFF_LIST_GET,
				type: 'GET',
				param: { staff_name: this.name, page: this.currentPage + 1 },
				loading: false
			}).then(res => {
				const { list, currentPage, totalPage } = res.data;
				list.forEach(item => this.list.push(item));
				this.currentPage = currentPage;
			}).catch(err => {
				this.$Message(err.msg);
			});
		}, 300),
		handleClick(e) {
			const val = e.target.getAttribute('value');
			this.inputVisible = false;
			this.$refs['input'].focus();
			const value = this.textvalue.substr(0, this.index + 1) + val;
			this.textvalue = value;
			this.$emit('input', this.textvalue);
		},
		getOffsetLeft(obj) {
			let tmp = obj.offsetLeft;
			let val = obj.offsetParent;
			while (val != null) {
				tmp += val.offsetLeft;
				val = val.offsetParent;
			}
			return tmp;
		},
		getOffsetTop(obj) {
			let tmp = obj.offsetTop;
			let val = obj.offsetParent;
			while (val != null) {
				tmp += val.offsetTop;
				val = val.offsetParent;
			}
			return tmp;
		}
	},
};
</script>

<style lang="scss" scoped>
.v-uniq-textarea {
	position: relative;
	width: 100%;
	._text-hidden {
		position: absolute;
		line-height: 1.5;
		padding: 4px 7px;
		// border: 1px solid #dcdee2;
		border-radius: 4px;
		cursor: text;
		font-size: 14px;
		left: 0;
		top: 0;
		visibility: hidden;
	}
	._poper_container {
		min-width: 120px;
		max-height: 180px;
		margin: 5px 0;
		padding: 5px 0;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 1px 6px rgba(0,0,0,.2);
		position: fixed;
		z-index: 900;

		._item {
			padding: 5px 15px;
		}
		._item:hover {
			background: #eee;
		}

		._spin {
			position: relative;
			height: 120px;
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .1s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}


}
</style>


