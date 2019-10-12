<template>
	<div class="codeWrapper">
		<div class="codeBg">
			<img src="static/img/coding.png" class="imgBg" />
			<img src="static/img/codslice.png" class="imgslice" />
			<div class="code"><img id="barcode" /></div>
			<div class="codeContent">
				<div>全国唯一编码：{{ code }}</div>
				<div>区块链Hash：{{ hash }}</div>
			</div>
		</div>
	</div>
</template>

<script>
var JsBarcode = require('JsBarcode');
export default {
	props: {
		code: {
			type: String,
			default: ''
		},
		hash: {
			type: String,
			default: ''
		},
		cod: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	},
	methods: {
		JsBarcode: function(code) {
			JsBarcode('#barcode', code, {
				format: 'CODE128',
				background: '#FFFFFF',
				displayValue: false,
				width: 5,
				height: 20
			});
		}
	},
	created: function() {},
	mounted: function() {
		this.JsBarcode(this.cod);
	}
};
</script>

<style scoped>
.codeWrapper {
	padding: 24px 36px;
	background: linear-gradient(to right, #70c60a 0%, #8dd439 100%);
}
.codeBg {
	width: 100%;
	height: 5.773333rem;
	position: relative;
	display: flex;
}
.codeBg img {
	height: 425px;
	width: 100%;
}
.imgBg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
}
.code {
	position: absolute;
	left: 20px;
	top: -6px;
	padding: 15px 20px;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.code img {
	width: 600px;
	height: 200px;
	/* transform: rotate(90deg) translate(45px, 60px); */
}
.codeContent {
	position: absolute;
	top: 220px;
	left: 35px;
	color: #535353;
	font-size: 27px;
}
.codeContent div {
	width: 95%;
	word-wrap: break-word;
	word-break: break-all;
	text-align: left;
	margin-bottom: 16px;
	font-size: 26px;
}
.imgslice {
	position: relative;
	top: 200px;
	left: 50px;
	width: 85% !important;
	height: 4px !important;
	z-index: 98;
}
</style>
