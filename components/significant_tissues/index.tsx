import React from 'react'
import { MetaNode } from '@/spec/metanode'
import * as t from 'io-ts'
import codecFrom from '@/utils/io-ts-codec'
import { tissue as tissue_icon, weighted as weighted_icon } from '@/icons'

export const SignificantTissueC = t.array(t.type({
  /**
   * The tissue term
   */
  tissue: t.string,
  /**
   * A zscore fir the significance
   */
  zscore: t.number,
}))

export const SignificantTissues = MetaNode.createData('SignificantTissues')
  .meta({
    label: 'SignificantTissues',
    description: 'Tissues scored using a combined stouffer statistic',
    icon: [weighted_icon, tissue_icon],
  })
  .codec(codecFrom(SignificantTissueC))
  .view(tissues => (
    <table>
      <thead>
        <tr>
          <th>Tissue</th>
          <th>ZScore</th>
        </tr>
      </thead>
      <tbody>
        {tissues.map(tissue =>
          <tr key={tissue.tissue}>
            <td>{tissue.tissue}</td>
            <td>{tissue.zscore.toPrecision(3)}</td>
          </tr>
        )}
      </tbody>
    </table>
  ))
  .build()
