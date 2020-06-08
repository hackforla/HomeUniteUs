// import { makeStyles, Theme } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) => {
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }, 
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
}

// export const useStyles = makeStyles((theme) => ({
//   modal: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));