/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import {red} from '@mui/material/colors';
import * as React from 'react';
import {AuthenticatedHeader} from '../features/ui';
import {
  DashboardDataItem,
  DashboardDataResponse,
  useAdminDeleteUserMutation,
  useGetAllDashboardDataMutation,
} from '../services/coordinator';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';

interface SystemAdminDashboardProps {}

interface SystemAdminDashboardState {
  rows: Array<DashboardDataItem>;
  userDeletion: {
    status: UserDeletionStatus;
    userId: number;
  };
  userError: {
    hasUnackedError: boolean;
    apiError: AdminApiError;
  };
}

enum SystemAdminDashboardActionType {
  RefreshDashboardItems,
  StartDeleteUser,
  CancelDeleteUser,
  ConfirmDeleteUser,
  FinishDeleteUser,
  DisplayErrorMessage,
  AckErrorMessage,
}

interface SystemAdminDashboardAction {
  type: SystemAdminDashboardActionType;
  payload?: string | number | Array<DashboardDataItem> | AdminApiError;
}

enum UserDeletionStatus {
  Ready,
  Confirming,
  Processing,
  DeleteCompleted,
}

const initialState: SystemAdminDashboardState = {
  rows: [],
  userDeletion: {
    status: UserDeletionStatus.Ready,
    userId: -1,
  },
  userError: {
    hasUnackedError: false,
    apiError: {
      message: '-',
      items: [],
    } as AdminApiError,
  },
};

function reducer(
  state: SystemAdminDashboardState,
  action: SystemAdminDashboardAction,
): SystemAdminDashboardState {
  switch (action.type) {
    case SystemAdminDashboardActionType.RefreshDashboardItems:
      return {
        ...state,
        userDeletion: {
          status: UserDeletionStatus.Ready,
          userId: -1,
        },
        rows: action.payload as Array<DashboardDataItem>,
      };

    case SystemAdminDashboardActionType.StartDeleteUser:
      return {
        ...state,
        userDeletion: {
          status: UserDeletionStatus.Confirming,
          userId: action.payload as number,
        },
      };

    case SystemAdminDashboardActionType.ConfirmDeleteUser:
      return {
        ...state,
        userDeletion: {
          ...state.userDeletion,
          status: UserDeletionStatus.Processing,
        },
      };

    case SystemAdminDashboardActionType.CancelDeleteUser:
      return {
        ...state,
        userDeletion: {
          ...state.userDeletion,
          userId: -1,
          status: UserDeletionStatus.Ready,
        },
      };

    case SystemAdminDashboardActionType.FinishDeleteUser:
      return {
        ...state,
        userDeletion: {
          ...state.userDeletion,
          userId: -1,
          status: UserDeletionStatus.DeleteCompleted,
        },
      };

    case SystemAdminDashboardActionType.DisplayErrorMessage:
      return {
        ...state,
        userError: {
          ...state.userError,
          hasUnackedError: true,
          apiError: action.payload as AdminApiError,
        },
      };

    case SystemAdminDashboardActionType.AckErrorMessage:
      return {
        ...state,
        userError: {
          ...state.userError,
          hasUnackedError: false,
          apiError: {
            message: '-',
            items: [],
          },
        },
      };

    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

/** An internal-only console for sysadmin functions  */
export function SystemAdminDashboard(props: SystemAdminDashboardProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const [getAllDashboardData, { isLoading, isSuccess, reset }] = useGetAllDashboardDataMutation();
  const [getAllDashboardData] = useGetAllDashboardDataMutation();
  const [adminDeleteUser] = useAdminDeleteUserMutation();

  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  //// simulate long-running process using timeout
  // timer.current = setTimeout(() => {
  //   dispatch({
  //     type: SystemAdminDashboardActionType.FinishDeleteUser
  //   });
  // }, 2000);

  /** Close the modal and forget about deleting the selected user */
  const refreshDashboardData = () => {
    getAllDashboardData()
      .unwrap()
      .then((dashboardDataResponse: DashboardDataResponse) => {
        dispatch({
          type: SystemAdminDashboardActionType.RefreshDashboardItems,
          payload: dashboardDataResponse.dashboardItems,
        });
      })
      .catch((reason: {data: AdminApiError}) => {
        displayErrorMessage({message: reason['data']['message'], items: []});
      });
  };

  React.useEffect(() => {
    refreshDashboardData();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  React.useEffect(() => {
    if (state.userDeletion.status === UserDeletionStatus.DeleteCompleted) {
      refreshDashboardData();
    }
  }, [state.userDeletion.status]);

  const buttonSx = {
    ...(state.userDeletion.status === UserDeletionStatus.Confirming && {
      bgcolor: red[500],
      '&:hover': {
        bgcolor: red[700],
      },
    }),
  };

  /** Close the modal and forget about deleting the selected user */
  const handleConfirmDeleteModalClosed = () => {
    dispatch({
      type: SystemAdminDashboardActionType.CancelDeleteUser,
    });
  };

  /** Attempts the actual user deletion via API request */
  const handleConfirmDelete = () => {
    if (state.userDeletion.status !== UserDeletionStatus.Confirming) {
      return;
    }
    dispatch({
      type: SystemAdminDashboardActionType.ConfirmDeleteUser,
    });

    adminDeleteUser(state.userDeletion.userId)
      .unwrap()
      .then(() => {
        dispatch({
          type: SystemAdminDashboardActionType.FinishDeleteUser,
        });
      })
      .catch((reason: {data: AdminApiError}) => {
        dispatch({
          type: SystemAdminDashboardActionType.FinishDeleteUser,
        });

        displayErrorMessage(reason['data']);
      });
  };

  /** Closes dialog and resets error data */
  const handleErrorMessageAcked = () => {
    dispatch({
      type: SystemAdminDashboardActionType.AckErrorMessage,
    });
  };

  /** Opens dialog and displays error data */
  const displayErrorMessage = (errorData: AdminApiError) => {
    dispatch({
      type: SystemAdminDashboardActionType.DisplayErrorMessage,
      payload: errorData,
    });
  };

  /** Initiates the deletion process by prompting user for confirmation */
  const startDelete = (userId: number) => {
    dispatch({
      type: SystemAdminDashboardActionType.StartDeleteUser,
      payload: userId,
    });
  };

  return (
    <>
      <Box>
        <AuthenticatedHeader />
        <Typography variant="h4" sx={{paddingTop: '60px'}}>
          System Administrator Dashboard
        </Typography>
        <Container maxWidth="lg">
          <TableContainer component={Paper}>
            {/* <Table sx={{ minWidth: 650 }} aria-label="simple table"> */}
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Coordinator</TableCell>
                  <TableCell align="center">Update</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.rows.map(row => (
                  <TableRow
                    key={row.id}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.userType}</TableCell>
                    <TableCell>{row.coordinatorName}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          console.log(`TODO: update user with id: ${row.id}`);
                        }}
                      >
                        <ChangeCircleRoundedIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          startDelete(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
      <Dialog
        sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
        maxWidth="md"
        open={
          [
            UserDeletionStatus.Confirming,
            UserDeletionStatus.Processing,
          ].indexOf(state.userDeletion.status) >= 0
        }
      >
        <DialogTitle>Delete user {state.userDeletion.userId}?</DialogTitle>
        <DialogContent dividers>
          <Typography component="p">
            This will remove the user from the Home Unite Us SQL database and
            the user pool in Cognito
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{m: 1, position: 'relative'}}>
              <Button
                autoFocus
                onClick={handleConfirmDeleteModalClosed}
                disabled={
                  state.userDeletion.status === UserDeletionStatus.Processing
                }
              >
                Cancel
              </Button>
            </Box>
            <Box sx={{m: 1, position: 'relative'}}>
              <Button
                variant="contained"
                sx={buttonSx}
                onClick={handleConfirmDelete}
                disabled={
                  state.userDeletion.status === UserDeletionStatus.Processing
                }
              >
                Ok
              </Button>
              {state.userDeletion.status === UserDeletionStatus.Processing && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: red[500],
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog
        sx={{'& .MuiDialog-paper': {width: '50%'}}}
        maxWidth="md"
        open={state.userError.hasUnackedError}
      >
        <DialogTitle>Error during delete</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item lg={12}>
              <Alert severity="error">{state.userError.apiError.message}</Alert>
              <div>
                <List>
                  {state.userError.apiError.items.length > 0 &&
                    state.userError.apiError.items.map(
                      (item: string, index: number) => (
                        <ListItem disablePadding key={`api-err-item-${index}`}>
                          <ListItemButton>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItemButton>
                        </ListItem>
                      ),
                    )}
                </List>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{m: 1, position: 'relative'}}>
              <Button autoFocus onClick={handleErrorMessageAcked}>
                OK
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
