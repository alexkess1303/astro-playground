import { useEffect, useState } from 'react'
import type { NatalChart, ChartRequest } from './app/api/types'
import { HouseSystemType } from './app/api/types'
import { fetchNatalChart } from './app/fetch/astrologyApi'
import BodyContainer from './components/BodyContainer/BodyContainer'
import Chart from './components/Chart/Chart'
import ChartData from './components/ChartData/ChartData'
import defaultBirthData from './app/api/defaultBirthData.json'

const birthRequest: ChartRequest = {
  ...(defaultBirthData as Omit<ChartRequest, 'houseSystem'>),
  houseSystem: HouseSystemType.Placidus,
}

function App() {
  const [chart, setChart] = useState<NatalChart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //console.log('Fetching natal chart with request:', birthRequest)
  //console.log('Fetched natal chart:', chart)


  useEffect(() => {
    fetchNatalChart(birthRequest)
      .then(setChart)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 16 }}>
        Calculating chart…
      </div>
    )
  }

  if (error || !chart) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#cc2222', fontSize: 14 }}>
        Error: {error ?? 'No data returned'}
      </div>
    )
  }

  return (
    <BodyContainer
      left={<Chart chart={chart} />}
      right={<ChartData chart={chart} birthData={birthRequest} />}
    />
  )
}

export default App
