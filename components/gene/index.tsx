import React from 'react'
import { MetaNode } from '@/spec/metanode'
import * as t from 'io-ts'
import codecFrom from '@/utils/io-ts-codec'
import dynamic from 'next/dynamic'
import useSWRImmutable from 'swr/immutable'
import levenSort from 'leven-sort'

const Suggest2 = dynamic(() => import('@blueprintjs/select').then(({ Suggest2 }) => Suggest2))
const Button = dynamic(() => import('@blueprintjs/core').then(({ Button }) => Button))
const MenuItem = dynamic(() => import('@blueprintjs/core').then(({ MenuItem }) => MenuItem))

const example = 'ACE2'

const fetcher = url => fetch(url).then(r => r.json())

function useHarmonizomeGeneSuggestions(search: string) {
  const { data, error } = useSWRImmutable(() => search.length >= 2 ? `https://maayanlab.cloud/Harmonizome/api/1.0/suggest?t=gene&q=${encodeURIComponent(search)}` : null, fetcher)
  const items = data ? levenSort(data, search).slice(0, 10) : []
  return { items, error }
}

const itemRenderer = (item: string, { modifiers: { active, disabled }, handleClick }: { modifiers: { active: boolean, disabled: boolean }, handleClick: React.MouseEventHandler }) => (
  <MenuItem
    key={item}
    text={item}
    onClick={handleClick}
    active={active}
    disabled={disabled}
  />
)
const createNewItemRenderer = (item: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => (
  <MenuItem
    key={item}
    text={item}
    onClick={handleClick}
    active={active}
  />
)
const createNewItemFromQuery = (item: string) => item
const inputValueRenderer = (item: string) => item

export const GeneSymbol = MetaNode.createData('GeneSymbol')
  .meta({
    label: 'Gene Symbol',
    description: 'An unresolved Gene Symbol',
    example,
  })
  .codec(codecFrom(t.string))
  .view(gene => (
    <div>{gene} (gene)</div>
  ))
  .build()

export const GeneSymbolInput = MetaNode.createProcess('GeneSymbolInput')
  .meta({
    label: 'Input a Gene',
    description: 'A gene input prompt',
    default: '',
  })
  .inputs()
  .output(GeneSymbol)
  .prompt(props => {
    const [item, setItem] = React.useState('')
    const [query, setQuery] = React.useState('')
    const { items, error } = useHarmonizomeGeneSuggestions(query)
    if (error) console.warn(error)
    React.useEffect(() => { setItem(props.output || '') }, [props.output])
    return (
      <div>
        <Suggest2
          fill
          closeOnSelect
          selectedItem={item}
          createNewItemFromQuery={createNewItemFromQuery}
          onItemSelect={(item: string) => setItem(item)}
          inputValueRenderer={inputValueRenderer}
          itemRenderer={itemRenderer}
          createNewItemRenderer={createNewItemRenderer}
          noResults={
            <MenuItem
              key="No results"
              text="No results"
              disabled
            />
          }
          items={items}
          inputProps={{ leftIcon: 'search', placeholder: `Search gene...` }}
          popoverProps={{ minimal: true }}
          onQueryChange={q => setQuery(q)}
        />
        <div>
          <Button
            large
            type="submit"
            text="Submit"
            rightIcon="send-to-graph"
            onClick={evt => props.submit(item)}
          />
        </div>
        <div>
          <Button
            large
            text="Example"
            rightIcon="bring-data"
            onClick={evt => props.submit(example)}
          />
        </div>
      </div>
    )
  })
  .build()
