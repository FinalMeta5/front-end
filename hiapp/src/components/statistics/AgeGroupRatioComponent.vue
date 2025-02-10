<template>
    <h3>사이트 이용자 연령대 비율</h3>
    <div class="chart-container">
        <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'AgeGroupRatioComponent',
    components: {
        Bar,
    },
    data() {
        return {
            loaded: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: '연령대별 회원 수',
                        data: [],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };
    },
    methods: {
        fetchChartData() {
            axios.get('http://localhost:8080/api/statistics/age-ratio')
                .then(response => {
                    const data = response.data;
                    this.chartData.labels = data.map(ageGroup => ageGroup.ageGroup);
                    this.chartData.datasets[0].data = data.map(ageGroup => ageGroup.count);
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