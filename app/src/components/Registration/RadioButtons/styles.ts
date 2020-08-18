import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
  createStyles({
    //example of additional classes for conditional styles used with theming
    radio: {
      color: theme.palette.secondary.main,
    },
  })
