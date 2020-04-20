<template>
	<div class="v-sale-customer-form">
		<slot/>
		<i-form ref="form" :model="formData" :label-width="110" inline>
			<div class="_form-item">
				<oa-form-item
					v-for="(item,index) in config"
					:key="index"
					:config="item"
					:form-data="formData"
				/>
			</div>
		</i-form>
	</div>
</template>

<script >
import { Form } from 'iview';
import FormItem from './pre-form-item';

export default {
	name: 'oa-form',
	components: {
		'i-form': Form,
		'oa-form-item': FormItem,

	},

	props: {
		config: Array,
	},
	data() {
		const formData = {};
		const formRule = {};
		// this.configs.list.forEach((item) => {
		//     formRule[item.prop] = item.rule;
		//     if (item.value !== undefined) {
		//         formData[item.prop] = item.value;
		//     } else if (item.itemType === 'input-number') formData[item.prop] = 0;
		//     else if (item.itemType === 'checkbox-group') {
		//         formData[item.prop] = [];
		//     } else {
		//         formData[item.prop] = '';
		//     }


		// });
		return {
			formData,
			formRule

		};
	},
	methods: {
		getForm() {
			return this.$refs.form;
		},
		getFormData() {
			return this.formData;
		}
	}
};
</script>

<style  lang="scss">
    .v-sale-customer-form {
        ._block-small {
            .ivu-form-item {
                width: 285px;
                &:nth-of-type(2n-1) {
                    margin-right: 55px;
                    // border: 1px red solid;
                }
            }
        }
        ._block {
            .ivu-form-item {
                width: 410px;
                &:nth-of-type(2n-1) {
                    margin-right: 80px;
                    // border: 1px red solid;
                }
            }
        }
        ._form-item {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        .ivu-input-number {
            width: 100%;
            .ivu-input-number-handler-wrap {
                display: none;
            }
        }
        .ivu-radio-group {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .ivu-radio-group-item {
                margin-right: 10px;
                margin-left: 10px;
            }
        }
        .ivu-checkbox-group {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .ivu-checkbox-group-item {
                margin-right: 10px;
                margin-left: 10px;
            }
        }
        ._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
            color: gray;
        }
        // ._footer {
        //     width: calc(100% - 180px);
        //     position: fixed;
        //     bottom: 0px;
        //     left: 180px;
        //     border-top: 1px solid #e8e8e8;
        //     padding: 10px 16px;
        //     background: #fff;
        //     text-align: center;
        // }
        // ._title-bar {
        //     display: inline-block;
        //     width: 3px;
        //     height: 14px;
        //     position: relative;
        //     top: 1px;
        // }
        // ._left-detail {
        //     padding: 15px;
        //     padding-top: 0;
        //     margin-top: 12px;
        //     > span {
        //         display: inline-block;
        //         padding-top: 15px;
        //         width: 340px;
        //     }
        // }
    }
</style>
