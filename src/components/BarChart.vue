<script>
  import { Bar } from 'vue-chartjs'
  import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

  export default {
    extends: Bar,
    props: ['cdata'],
    mounted () {
      // Overwriting base render method with actual data.
      this.renderChart(this.cdata,
        {
          responsive: true,
          maintainAspectRatio: false,
          staked:true,
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].backgroundColor }
              }
            }
          }
        }
      )
    }
  }
</script>