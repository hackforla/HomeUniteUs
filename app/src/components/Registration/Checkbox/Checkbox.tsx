import * as React from 'react'
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core'
import { styles } from './styles'

interface Props extends WithStyles<typeof styles> {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  options: Array<any>
  value?: any
  helperText?: string
}

//checkbox for multi-select
const CheckboxInput = (props: Props) => {
  const { onChange, label, options, value, helperText, classes } = props

  return (
    <>
      <FormControl className={classes.checkbox} component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          {options.map((option: any) => {
            return (
              <FormControlLabel
                key={option.value}
                label={option.label}
                control={
                  <Checkbox
                    checked={value && !!value[option.value]}
                    onChange={onChange}
                    name={option.value}
                    value={option.value}
                  />
                }
              />
            )
          })}
        </FormGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </>
  )
}

export default withStyles(styles)(CheckboxInput)
