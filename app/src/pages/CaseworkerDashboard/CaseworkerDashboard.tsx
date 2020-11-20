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

  const displayCases: any = () => {
    {console.log(state?.cases?.data, "<------------is it in state tho?")}
    return state.cases.data.map(case => {
      return (
      <h1>{case._id}</h1>
      )
    })
  }

  return (
    <Container maxWidth={false}>
      <Paper>
        <h1>Caseworker Dashboard</h1>
      </Paper>

      <Container fixed>
        <Typography variant="h6">Total Cases: 10</Typography>
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
            {displayCases()}
        </TableBody>

          </Table>
        </TableContainer>
      </Container>
    </Container>
  )
}

