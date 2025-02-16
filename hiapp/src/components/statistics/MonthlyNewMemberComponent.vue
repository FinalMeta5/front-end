<template>
    <h3>매 달 신규 가입자</h3>
    <div class="chart-container">
        <Line v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { authAxios } from '../../store/auth/auth';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
    name: 'MonthlyNewMemberComponent',
    components: {
        Line,
    },
    data() {
        return {
            loaded: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: '신규 가입 수',
                        data: [],
                        backgroundColor: '#f87979',
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        // max: 3,
                        min: 0,
                    },
                }
            },
        };
    },
    methods: {
        fetchChartData() {
            authAxios.get('/api/statistics/monthly-member')
                .then(response => {
                    const data = response.data;
                    this.chartData.labels = data.map(monthlyNewMem => monthlyNewMem.month);
                    this.chartData.datasets[0].data = data.map(monthlyNewMem => monthlyNewMem.count);
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