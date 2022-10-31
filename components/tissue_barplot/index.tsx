import python from '@/utils/python'
import { PlotlyPlot } from '@/components/plotly'
import { MetaNode } from '@/spec/metanode'
import { SignificantTissues } from '@/components/significant_tissues'
import { barchart as barchart_icon } from '@/icons'

export const TissueBarplotFromSignificantTissue = MetaNode.createProcess('TissueBarplotFromSignificantTissue')
  .meta({
    label: 'Tissue Barplot from Significant Tissues',
    description: 'Construct Tissue Barplot with Significant Tissues',
    icon: [barchart_icon],
  })
  .codec()
  .inputs({ tissues: SignificantTissues })
  .output(PlotlyPlot)
  .resolve(async (props) => await python(
    'components.tissue_barplot.tissue_barplot',
    { kargs: [props.inputs.tissues] },
  ))
  .build()
