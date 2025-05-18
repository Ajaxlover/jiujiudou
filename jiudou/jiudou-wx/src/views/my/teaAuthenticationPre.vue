<template>
    <div class="page-tea-authentication-pre">
        <div class="content">
            <div class="iframe-parent">
                <iframe class="iframe" src="https://static.guangyiedu.com/xieyi/tecRenZheng/index.html"
                    frameborder="0"></iframe>
            </div>
            <div class="button-commit">
                <van-button type="primary" size="normal" round color="#10c4ee"
                    @click="toAuthentication">立即认证</van-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },

    methods: {
        toAuthentication() {
            this.$router.replace('/teaAuthentication')
        }
    },
}
</script>


<style lang="scss" scoped>
.page-tea-authentication-pre {
    height: 100vh;

    .iframe-parent {
        height: 90vh;

        .iframe {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }

    .button-commit {
        width: 100%;
        text-align: center;
        height: 6vh;
        position: absolute;
        bottom: 2vh;

        .van-button {
            width: 90%;
        }
    }

}
</style>