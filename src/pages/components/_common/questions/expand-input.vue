<template>
	<div class="g-dp-ib v-expand-input">
		<input 
			:style="{width:width+'px'}" 
			:value="inputValue" 
			:maxlength="maxlength" 
			:placeholder="placeholder"
			class="_input"
			@input="handleInput"
		>
		<span ref="span1" class="g-absolute" style="visibility: hidden;">{{ inputValue }}</span>
	</div>
</template>
<script>
export default {
	name: 'oa-',
	components: {

	},
	props: {
		value: String,
		minWidth: {
			type: Number,
			default: 100
		},
		maxWidth: {
			type: Number,
			default: 200
		},
		extraWidth: {
			type: Number,
			default: 22
		},
		maxlength: {
			type: Number,
			default: 10
		},
		placeholder: String

	},
	data() {
		return {
			inputValue: this.value,
			width: this.minWidth

		};
	},
	methods: {
		handleInput(e) {
			this.inputValue = e.target.value;
			this.$emit('input', this.inputValue);
			this.updateWidth();

		},
		updateWidth() {
			this.$nextTick(() => {
				const width = this.$refs.span1.clientWidth + this.extraWidth;
				if (width > this.maxWidth) {
					this.width = this.maxWidth;
				} else if (width < this.minWidth) {
					this.width = this.minWidth;
				} else {
					this.width = width;
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-expand-input {
	._input {
		border-bottom:1px solid #333;
		padding: 0 10px;
		width:100px;
		&:focus {
			box-shadow: none;
			outline: none;
		}
		&::placeholder {
			color: #bbb;
		}
	}
}
</style>