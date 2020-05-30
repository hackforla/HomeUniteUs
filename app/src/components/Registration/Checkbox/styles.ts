export const styles = (theme: any) => ({
    //example of additional classes for conditional styles used with theming
    checkbox: {
        color: theme.palette.primary.secondary, //<-- an example to showcase themeing
    },
})

//potential idea is a 'checkboxLarge' for the styles that have larger checkbox inputs
//as there will be various resizing

//a prop can be used on the component to conditionally render the correct style
