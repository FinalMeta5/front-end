<template>
    <h3>별점 높은 순</h3>
    <div class="chart-container">
        <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { authAxios } from '../../store/auth/auth';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: 'MemberRate',
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
                        label: '평균 별점',
                        data: [],
                        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FFAAAA'],
                    },
                ],
            },
            chartOptions: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: false,
                            text: '별점'
                        },
                        max: 5,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '별점 높은 순'
                    }
                }
            },
        };
    },
    methods: {
        fetchChartData() {
            authAxios.get('/api/statistics/member-rate')
                .then(response => {
                    const data = response.data;
                    this.chartData.labels = data.map(rate => rate.name);
                    this.chartData.datasets[0].data = data.map(rate => rate.avgRate);
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