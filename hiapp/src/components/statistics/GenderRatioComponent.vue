<template>
    <h3>사이트 이용자 남여 비율</h3>
    <div class="chart-container">
        <Doughnut v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import axios from 'axios';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
    name: 'GenderRatioComponent',
    components: {
        Doughnut,
    },
    data() {
        return {
            loaded: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: '성별 비율',
                        data: [],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)', // 남자 색상
                            'rgba(255, 99, 132, 0.7)', // 여자 색상
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        reverse: true,
                    },
                    title: {
                        display: true,
                        text: '사이트 이용자 성별 비율',
                    },
                },
            },
        };
    },
    methods: {
        fetchChartData() {
            axios.get('http://localhost:8080/api/statistics/gender-ratio')
                .then(response => {
                    const data = response.data;
                    this.chartData.labels = data.map(genderRatio => genderRatio.gender);
                    this.chartData.datasets[0].data = data.map(genderRatio => genderRatio.count);
                    this.loaded = true;
                })
                .catch(error => {
                    console.error('데이터를 가져오는 중 오류 발생:', error);
                });
        },
    },
    mounted() {
        this.fetchChartData();
    },
};
</script>

<style scoped>
.chart-container {
    width: 80%;
    margin: 0 auto;
}
</style>