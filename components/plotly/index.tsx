import React from 'react'
import { MetaNode } from '@/spec/metanode'
import type { PlotParams } from 'react-plotly.js'
import dynamic from 'next/dynamic'
import { plot as plot_icon } from '@/icons'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false, loading: () => <div>Loading...</div> })

export type PlotlyJson = {
  data: PlotParams['data'],
  layout: PlotParams['layout'],
  frames?: PlotParams['frames'],
}

export const PlotlyPlot = MetaNode.createData('PlotlyPlot')
  .meta({
    label: 'Plotly Plot',
    description: 'A plot rendered using the plotly.js library',
    icon: [plot_icon],
  })
  .codec<PlotlyJson>()
  .view(props => <Plot {...props} />)
  .build()
