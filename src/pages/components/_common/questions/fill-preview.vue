
<script >
import ExpandInput from './expand-input';

export default {
	name: "c-single-select",
	props: {
		title: String,
		options: Array,
		disabled: {
			type: Boolean,
			default: true
		},
		value: [Array],
		maxWidth: {
			type: Number,
			default: 650

		}
	},
	data() {
		const answers = Array.isArray(this.value) ? [...this.value] : [];
		for (let i = 0; i < this.title.split(/_+/).length - 1; i++) {
			answers.push('');
		}
		return { answers };

	},
	computed: {
		titleSplit() {
			return this.title.split(/_+/);
		}

	},
	methods: {
		handleInput(e, i) {
			this.answers[i] = e;
			this.$emit('input', this.answers);
		}

	},
	render(h) {
		const arr = [];
		for (let i = 0; i < this.titleSplit.length; i++) {
			arr.push(this.titleSplit[i]);
			if (i < this.titleSplit.length - 1) {
				if (this.disabled) {
					arr.push(<u class="g-c-orange-mid">&nbsp; {(this.options[i] || { label: '' }).label} &nbsp;</u>);
				} else {
					arr.push(<ExpandInput value={this.answers[i]} onInput={(e) => this.handleInput(e, i)} placeholder="填写答案" />);
				}
			}
		}

		return <div class="v-question-fill-preview" style={{ maxWidth: this.maxWidth + 'px', lienHeight: '20px', wordBreak: 'break-all' }} >
			{arr}
		</div>;

	}
	
	
};
</script>
<style lang="scss">

</style>