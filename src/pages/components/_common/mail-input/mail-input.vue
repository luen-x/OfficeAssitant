<template>
	<div 
		:class="{'mail-input': true, 'g-flex': true, 'mail-input-focus': focus}"
		@click.self="handleClick"
	>
		<template v-for="(item, index) of emails">
			<div
				v-if="!editArr[index]"
				:key="index" 
				:class="{'_item': true, 'g-m-r-5': true, '_error': item.valid,'g-m-b-5': true }" 
				@dblclick="() => handleDouble(index)"
			>
				<div class="g-flex g-ai-c">
					<!-- {{ item.email.replace(/\s/g, '&nbsp;') }} -->
					<span>{{ item.email.replace(/\s/g, "") }}</span>
					<i 
						class="icon iconfont icon-clear g-fs-14 g-tc"
						style="transform: scale(0.6, 0.6);"
						@click.stop="() => handleDel(index)"
					/>
				</div>
			</div>
			
			<input 
				v-else
				ref="input"
				:value="item.email"
				:key="index"
				type="text"
				@focus="handleFocus" 
				@input="(e) => handleInnerInput(e, index)"
				@blur="handleInnerBlur"
			>

			<span
				:ref="'span_'+index" 
				:key="index + 'i'"
				style="visibility: hidden;white-space:nowrap;" 
				class="g-absolute"
			>
				{{ item.email.replace(/\s/g, "") }}
			</span>
		</template>
		<input 
			ref="inputOuter"
			:value="outer.replace(/\s/g, '')"  
			type="text" 
			class="g-m-b-5"
			style="padding-left: 5px;padding-left: 5px;"
			placeholder="按；保存输入"
			@input="handleOuterInput"
			@focus="handleFocus" 
			@blur="handleOuterBlur"
		>
		<span 
			ref="inputOuterSpan"
			style="visibility: hidden;white-space:nowrap;" 
			class="g-absolute"
		>
			{{ outer.replace(/\s/g, "") }}
		</span>
	</div>
</template>

<script>
export default {
	name: 'mail-input',
	props: {
		dataSource: Array
	},
	data() {
		return {
			focus: false,
			// emails 需要根据props生成
			emails: [
				// email的两种格式
				// {
				// 	email: 'xxxx@xxxx'
				// }, 
				// {
				// 	email: '公司名称<xxxx@xxxx>'
				// }
			],
			editArr: [],
			outer: ''
		};
	},
	watch: {
		emails(newval, oldval) {
			newval.length !== oldval.length && this.handleEditArr();
		},

		dataSource(val) {
			this.emails = val;

			this.emails.forEach(item => {
				if (!this.handleRegex(item.email)) {
					item.valid = true;
				}
			});

			this.handleRemoval();
		}
	},
	methods: {
		// 聚焦输入框
		handleFocus() {
			this.focus = true;
		},

		// 失焦
		handleBlur() {
			this.focus = false;
		},

		// 生成是否编辑数组
		handleEditArr() {
			this.editArr = this.emails.map(item => 0);
		},

		// 校验邮箱
		handleRegex(email) {
			let val = "";

			if (email && email.indexOf("<") > -1) {
				val = email.split("<")[1].split(">")[0];
			} else {
				val = email;
			}

			// const regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
			const regex = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
			return regex.test(val);
		},

		// 编辑失焦 
		handleInnerBlur() {
			this.handleBlur();
			this.editArr = this.editArr.map(item => 0);
		},

		// 新增失焦
		handleOuterBlur() {
			this.handleBlur();
		},

		handleDouble(index) {
			this.editArr.splice(index, 1, 1);
			
			this.$nextTick(() => {
				this.$refs.input[0].focus();
				this.$refs["input"][0].style.width = this.$refs["span_" + index][0].offsetWidth + 10 + "px";
			});
			// let emails = [...this.emails];
			// emails[index].isEdit = true;
			// this.emails = emails;
		},

		handleClick() {
			this.$refs.inputOuter.focus();
			this.handleFocus();
		},

		handleDel(index) {
			this.emails.splice(index, 1);
		},

		handleOuterInput(e) {
			const data = e.data;

			if (data === " ") {
				return;
			}
			
			let val = e.target.value;
			let lastKey = val.substring(val.length - 1, val.length);
			(!data && !(lastKey === ';' || lastKey === '；')) ? val += ";" : "";
			this.outer = val;
			this.handleInput(data, val);
		},

		handleInnerInput(e, index) {
			e.target.value = e.target.value.replace(/\s/g, "");
			const val = e.target.value.replace(/\s/g, "");
			const data = e.data;

			if (data === " ") {
				return;
			}

			this.handleInput(data, val, index);

			this.$nextTick(() => {
				this.$refs["input"][0].style.width = this.$refs["span_" + index][0].offsetWidth + 10 + "px";
			});
		},

		// 处理输入数据
		handleInput(data, value, index) {
			if (!index && index != 0) {
				const lastKey = value.substring(value.length - 1, value.length);

				this.$nextTick(() => {
					this.$refs["inputOuter"].style.width = 	(this.$refs["inputOuterSpan"].offsetWidth + 20) < 100 
						? "100px" : this.$refs["inputOuterSpan"].offsetWidth + 20 + "px";
				});

				if ((lastKey === ';' || lastKey === '；')) {
					const val = value;
					let arr = value.split(lastKey);

					arr.forEach((item, itemIndex, array) => {
						if (item.trim() !== "" && itemIndex < array.length - 1) {
							const obj = { email: item, valid: !this.handleRegex(item) };
							this.emails.push(obj);
						}
					});

					this.outer = "";
					// 失焦
					this.handleOuterBlur();
				}
			} else {
				const val = value;
				let isError = this.handleRegex(val);

				if (val.trim() !== "") {
					const obj = { email: val, valid: !isError };

					typeof index === 'number' 
						? this.emails.splice(index, 1, obj) 
						: this.emails.push(obj);
				}
			}

			this.handleRemoval();
		},

		// 	去重
		handleRemoval() {
			let obj = {};
			let arr = [];
			
			this.emails.forEach(item => {
				if (!obj[item.email]) {
					obj[item.email] = 1;
					arr.push(item);
				}
			});

			this.emails = arr;
		}
	}
};
</script>

<style lang="scss" scoped>
.mail-input {
		display: inline-block;
		width: 100%;
		padding: 5px 7px 0px 7px;
		//border: 1px solid #dcdee2;
		border: 1px solid #ffffff;
		border-radius: 4px;
		color: #515a6e;
		background-color: #fff;
		background-image: none;
		position: relative;
		transition: border .2s;
		cursor: text;
		outline: none;

	._item {
		display: inline-block;
		padding: 0 4px 0 8px;
		border: 1px solid #e8eaec;
		border-radius: 3px;
		background: #f7f7f7;
		cursor: pointer;

		.icon {
			display: inline-block;
			width: 20px;
			height: 20px;
		}

		.icon:hover {
			border-radius: 50%;
			background: #e8eaec;
		}
	}

	._error {
		color: #e74854;
		border-color: #e74854;
		background: #fff;
	}

	&:hover {
		//border-color: #57a3f3;
		border-color: #ffffff;
	}
}

.mail-input-focus {
	//border-color: #57a3f3;
	border-color: #ffffff;
	box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
</style>