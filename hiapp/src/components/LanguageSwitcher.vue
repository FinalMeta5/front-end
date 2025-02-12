<template>
    <div class="language-switcher">
        <button v-if="lang === 'ko'" @click="switchLanguage()" class="btn btn-sm btn-outline-secondary same-size" type="button">
            A
        </button>
        <button v-if="lang === 'en'" @click="switchLanguage()" class="same-size btn btn-sm btn-outline-secondary" type="button">
            가
        </button>
    </div>
</template>

<script>
export default {
    name: 'LanguageSwitcher',
    data() {
        return {
            // 지원하는 언어 정보
            languages: [ 'en', 'ko' ],
            lang: 'ko',
        };
    },
    methods: {
        async switchLanguage() {
            this.lang = this.languages.shift();
            // 동적 로딩: 해당 언어 메시지가 없거나 빈 객체라면 불러오기
            if (!this.$i18n.getLocaleMessage(this.lang) || Object.keys(this.$i18n.getLocaleMessage(this.lang)).length === 0) {
                try {
                    // 동적 import 사용 (alias "@"가 설정되어 있어야 합니다)
                    const messages = await import(`../locales/${this.lang}.json`);
                    this.$i18n.setLocaleMessage(this.lang, messages.default);
                } catch (error) {
                    console.error(`메시지를 불러오지 못했습니다: ${this.lang}`, error);
                    return;
                }
            }
            // 전역 locale 변경 및 드롭다운 닫기
            this.$i18n.locale = this.lang;
            this.languages.push(this.lang);
        },
    },
};
</script>

<style scoped>
    .same-size {
        max-width: 30px;
        min-width: 30px;
    }
</style>