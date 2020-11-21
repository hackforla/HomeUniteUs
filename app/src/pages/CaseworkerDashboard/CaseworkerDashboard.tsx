import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Container, TableBody, Typography } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { useCaseworkerDashboard, CaseworkerDashboardDataProvider } from '../../data/caseworker-context'


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface Props {
  
}

export const CaseworkerDashboardContainer = () => {
  return(
    <CaseworkerDashboardDataProvider>
      <CaseworkerDashboard />
    </CaseworkerDashboardDataProvider>
  )
}

export function CaseworkerDashboard({}: Props) {
  const { state, dispatch } = useCaseworkerDashboard()
  const classes = useStyles();

  const displayCases = (): JSX.Element | JSX.Element[] => {
    if(!state){
      return (
        <p>Loading....</p>
      )
    } else {
      return state?.cases?.map(e => {
        return (
          <TableRow key={e._id}>
            <TableCell component="th" scope="row">
              {e._id}
            </TableCell>
            <TableCell align="center">{e.guest_id}</TableCell>
            <TableCell align="center">{e.status_id}</TableCell>
          </TableRow>
        )
      })
    }
  }

  return (
    <Container maxWidth={false}>
      <Paper>
        <h1>Caseworker Dashboard</h1>
      </Paper>

      <Container fixed>
        <Typography variant="h6">Total Cases: {state?.cases?.length}</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">

          <TableHead>
            <TableRow>
              <TableCell>CASE NUMBER</TableCell>
              <TableCell align="center">GUEST NAME</TableCell>
              <TableCell align="center">STATUS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {console.log(state, "<-----------the state is?")}
            {displayCases()}
        </TableBody>

          </Table>
        </TableContainer>
      </Container>
    </Container>
  )
}

