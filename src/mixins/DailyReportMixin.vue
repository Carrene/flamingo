<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  name: 'DailyReportMixin',
  data () {
    return {
      emptyDailyReports: [],
      registeredDailyReports: []
    }
  },
  computed: {
    dailyReports () {
      let compareFunction = (itemOne, itemTwo) => {
        return moment(itemTwo.date).format('YYYYMMDD') - moment(itemOne.date).format('YYYYMMDD')
      }
      return this.registeredDailyReports.concat(this.emptyDailyReports).sort(compareFunction)
    },
    ...mapState([
      'DailyReport',
      'Item',
      'weeklyOffDays',
      'events'
    ])
  },
  methods: {
    async listDailyReports (item) {
      if (!item) {
        this.registeredDailyReports = []
        this.generateEmptyDailyReports = []
        return
      }
      let resp = await this.DailyReport
        .load(undefined, `${this.Item.__url__}/${item.id}/${this.DailyReport.__url__}`)
        .sort('-date')
        .send()
      this.registeredDailyReports = resp.models
      this.generateEmptyDailyReports(item)
    },
    generateEmptyDailyReports (item) {
      this.emptyDailyReports = []
      if (!item) {
        return
      }
      if (!item.startDate) {
        return
      }
      let startDate = moment(item.startDate)
      let endDate = moment(item.endDate)
      let diff = endDate.diff(startDate, 'days')
      for (let i = 0; i <= diff; i++) {
        let day = startDate.clone().add(i, 'days')
        if (this.checkDayNeedEmptyDailyReport(day)) {
          this.emptyDailyReports.push(new this.DailyReport({
            date: day.format('YYYY-MM-DD'),
            itemId: item.id
          }))
        }
      }
    },
    checkDayIsOff (day) {
      return this.weeklyOffDays.includes(day.format('dddd').toLowerCase())
    },
    checkDayIsInEvents (day) {
      let eventDates = this.events.map(item => {
        return {
          startDate: moment(item.startDate),
          endDate: moment(item.endDate),
          repeat: item.repeat
        }
      })
      for (let event of eventDates) {
        switch (event.repeat) {
          case 'never':
            return day.isBetween(event.startDate, event.endDate, 'day', '[]')
          case 'monthly':
            if (event.startDate.format('MM') === event.endDate.format('MM')) {
              return day.isBetween(
                event.startDate.month(day.month()),
                event.endDate.month(day.month()),
                'day',
                '[]'
              )
            } else {
              return day.isBetween(
                event.startDate.month(day.month()),
                event.endDate.month(day.month() + 1),
                'day',
                '[]'
              ) ||
                day.isBetween(
                  event.startDate.month(day.month() - 1),
                  event.endDate.month(day.month()),
                  'day',
                  '[]'
                )
            }
          case 'yearly':
            if (event.startDate.format('YYYY') === event.endDate.format('YYYY')) {
              return day.isBetween(
                event.startDate.year(day.year()),
                event.endDate.year(day.year()),
                'day',
                '[]'
              )
            } else {
              return day.isBetween(
                event.startDate.year(day.year()),
                event.endDate.year(day.year() + 1),
                'day',
                '[]'
              ) ||
                day.isBetween(
                  event.startDate.year(day.year() - 1),
                  event.endDate.year(day.year()),
                  'day',
                  '[]'
                )
            }
        }
      }
    },
    checkDayIsAfterToday (day) {
      return day.isAfter(moment())
    },
    checkDayAlreadyHasDailyReport (day) {
      return this.registeredDailyReports
        .map(item => moment(item.date))
        .some(item => day.isSame(item, 'day'))
    },
    checkDayNeedEmptyDailyReport (day) {
      return !this.checkDayIsAfterToday(day) &&
        !this.checkDayIsOff(day) &&
        !this.checkDayAlreadyHasDailyReport(day) &&
        !this.checkDayIsInEvents(day)
    }
  }
}
</script>
