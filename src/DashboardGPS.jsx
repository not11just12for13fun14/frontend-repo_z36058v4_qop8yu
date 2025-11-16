import Layout from './components/Layout'
import LiveTracking from './components/LiveTracking'
import Devices from './components/Devices'
import History from './components/History'

export default function DashboardGPS(){
  return (
    <Layout>
      <LiveTracking />
      <Devices />
      <History />
    </Layout>
  )
}
