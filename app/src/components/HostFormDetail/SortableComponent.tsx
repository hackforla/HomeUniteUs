import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { Card } from '@material-ui/core'
import GridOnIcon from '@material-ui/icons/GridOn'

const SortableItem = SortableElement((props: any) => (
    <div style={{ margin: '1rem', cursor: 'pointer', marginLeft: '0' }}>
        <Card style={{ padding: '1rem 0 1rem 0' }}>
            {' '}
            <GridOnIcon
                style={{
                    color: 'blue',
                    verticalAlign: 'middle',
                    padding: '0 0 0 0.5rem',
                }}
            />{' '}
            {props.value}
        </Card>
    </div>
))

const SortableList = SortableContainer((props: any) => {
    return (
        <ul style={{ padding: '0px' }}>
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

    const onSortEnd = (props: any) => {
        // setState(({items}) => ({
        //   items: arrayMove(items, oldIndex, newIndex),
        // }));
        setContactOrder(arrayMove(contactOrder, props.oldIndex, props.newIndex))
    }

    return <SortableList items={contactOrder} onSortEnd={onSortEnd} />
}

export default SortableComponent
