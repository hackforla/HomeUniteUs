import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { Card } from '@material-ui/core'

const SortableItem = SortableElement((props: any) => (
  <div>
    <Card>{props.value}</Card>
  </div>
))

const SortableList = SortableContainer((props: any) => {
  return (
    <ul>
      {props.items.map((value: string, index: number) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  )
})

function SortableComponent() {
  const [contactOrder, setContactOrder] = useState([
    'Email',
    'SMS',
    'Phone Call',
  ])

  const onSortEnd = (props: any) => {
    // setState(({items}) => ({
    //   items: arrayMove(items, oldIndex, newIndex),
    // }));
    setContactOrder(arrayMove(contactOrder, props.oldIndex, props.newIndex))
  }

  return <SortableList items={contactOrder} onSortEnd={onSortEnd} />
}

export default SortableComponent
