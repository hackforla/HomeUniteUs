import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { Card } from '@material-ui/core'

const SortableItem = SortableElement((props: any) => (
    <div style={{ border: '1px solid red' }}>
        <Card>{props.value}</Card>
    </div>
))

const SortableList = SortableContainer((props: any) => {
    return (
        <ul>
            {props.items.map((value: string, index: number) => (
                <SortableItem
                    key={`item-${value}`}
                    index={index}
                    value={value}
                />
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
    return <SortableList items={contactOrder} />
}

export default SortableComponent
