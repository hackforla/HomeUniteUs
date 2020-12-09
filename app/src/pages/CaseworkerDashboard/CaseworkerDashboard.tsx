import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, TableBody, TextField, Typography } from '@material-ui/core';
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
  const [search, setSearch] = React.useState("")
  const classes = useStyles();

  const displayCases = (): JSX.Element | JSX.Element[] => {
    if(!state){
      return (
        <TableRow>
          <TableCell component="th" scope="row">
            Loading...
          </TableCell>
          <TableCell align="center">Loading...</TableCell>
          <TableCell align="center">Loading...</TableCell>
        </TableRow>
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

  const handleSearch = (ev: any): void => {
    setSearch(ev.target.value)
  }

  return (
    <Container maxWidth={false}>
      {/* <Paper> */}
        <h1>Caseworker Dashboard</h1>
        <hr />
      {/* </Paper> */}

      <Container fixed>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Total Cases: {state?.cases?.length}</Typography>
          <TextField id="outlined-basic" label="Search for a Guest or Case Number" variant="outlined" style={{ width: "50%"}} onChange={handleSearch} value={search}/>
        </Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">

          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold"}}>CASE NUMBER</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold"}}>GUEST NAME</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold"}}>STATUS</TableCell>
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

