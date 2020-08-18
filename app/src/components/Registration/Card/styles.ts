import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
  createStyles({
    card: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: theme.spacing(1),
      width: theme.spacing(14),
      height: theme.spacing(14),
      padding: theme.spacing(1),
    },
  })
