import humanizeDuration from 'humanize-duration'

const getTimeSpent = timeInMs => humanizeDuration(timeInMs, { units: ['h', 'm'], round: true })

export default getTimeSpent
