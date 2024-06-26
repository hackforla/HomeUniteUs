import {useState} from 'react';
import {Box, Tabs, Tab, Typography, Pagination, Stack} from '@mui/material';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import {faker} from '@faker-js/faker';
import {styled} from '@mui/material/styles';

import {GuestInviteButton} from '../components/common';
import {LoadingComponent} from './LoadingComponent';

const buildRow = () => {
  return {
    id: faker.string.uuid(),
    applicant: faker.person.fullName(),
    type: faker.helpers.arrayElement(['Guest', 'Host']),
    status: faker.helpers.arrayElement(['In Progress', 'Complete']),
    coordinator: faker.helpers.arrayElement([
      faker.person.fullName(),
      'Unassigned',
    ]),
    updated: faker.date.past().toLocaleDateString(),
    notes: faker.lorem.words({min: 0, max: 15}),
  };
};
const rows: GridRowsProp = Array.from(Array(30), () => buildRow());

const columns: GridColDef[] = [
  {
    field: 'applicant',
    headerName: 'Applicant',
    flex: 1,
  },
  {field: 'type', headerName: 'Type'},
  {field: 'status', headerName: 'Status'},
  {field: 'coordinator', headerName: 'Coordinator', flex: 1},
  {field: 'updated', headerName: 'Updated', flex: 1},
  {
    field: 'notes',
    headerName: 'Notes',
    editable: true,
    flex: 1,
  },
];

function a11yProps(index: number) {
  return {
    id: `dashboard-tabs-${index}`,
    'aria-controls': `dashboard-2-${index}`,
  };
}

export const CoordinatorDashboard = () => {
  const [value, setValue] = useState(0);

  const data = rows.filter(row => {
    if (value === 0) {
      return row;
    } else if (value === 1) {
      return row.type === 'Guest';
    } else if (value === 2) {
      return row.type === 'Host';
    }
  });

  const totalGuests = rows.filter(row => row.type === 'Guest').length;
  const totalHosts = rows.filter(row => row.type === 'Host').length;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <StyledPageContainer>
      <Box
        sx={{
          display: 'grid',
          gridColumn: {
            sm: '1 / 5',
            md: '1 / 9',
            lg: '2 / 12',
          },
        }}
      >
        <Stack
          sx={{width: '100%', mb: 4.5}}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1" sx={{fontSize: 36, fontWeight: 'bold'}}>
            Dashboard
          </Typography>
          <GuestInviteButton />
        </Stack>

        <Box>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard-tabs"
          >
            <StyledTab
              icon={
                <StyledUserCount>
                  <Typography fontSize="14px" fontWeight="bold">
                    {rows.length}
                  </Typography>
                </StyledUserCount>
              }
              iconPosition="end"
              label="All"
              {...a11yProps(0)}
            />
            <StyledTab
              icon={
                <StyledUserCount>
                  <Typography fontSize="14px" fontWeight="bold">
                    {totalGuests}
                  </Typography>
                </StyledUserCount>
              }
              iconPosition="end"
              label="Guests"
              {...a11yProps(1)}
            />
            <StyledTab
              icon={
                <StyledUserCount>
                  <Typography fontSize="14px" fontWeight="bold">
                    {totalHosts}
                  </Typography>
                </StyledUserCount>
              }
              iconPosition="end"
              label="Hosts"
              {...a11yProps(2)}
            />
          </StyledTabs>
        </Box>
        <StyledDataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={data ? data : []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{
            pagination: CustomPagination,
            noRowsOverlay: LoadingComponent,
          }}
          sx={{
            height: '538.75px',
          }}
        />
      </Box>
    </StyledPageContainer>
  );
};

const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      page={page + 1}
      count={pageCount}
      onChange={(event: React.ChangeEvent<unknown>, value: number) =>
        apiRef.current.setPage(value - 1)
      }
    />
  );
};

const StyledPageContainer = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.grey[50],
  display: 'grid',
  padding: `${theme.spacing(6)} ${theme.spacing(2)}`,
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(8, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
  gridAutoRows: 'min-content',
}));

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

const StyledTab = styled(Tab)(({theme}) => ({
  textTransform: 'none',
  fontWeight: 'medium',
  fontSize: theme.typography.pxToRem(24),
  color: theme.palette.text.secondary,
  minHeight: 'auto',
  padding: theme.spacing(2, 4),
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  '&.Mui-selected': {
    color: theme.palette.text.primary,
    backgroundColor: '#E8E8E8',

    '& .MuiTab-iconWrapper': {
      backgroundColor: theme.palette.text.secondary,
      color: theme.palette.primary.contrastText,
      border: 'none',
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#F8F8F8',
  },
  '.MuiTab-iconWrapper': {
    marginLeft: theme.spacing(2),
  },
}));

const StyledUserCount = styled(Stack)(({theme}) => ({
  border: `2px solid ${theme.palette.text.secondary}`,
  borderRadius: '50%',
  height: '24px',
  width: '24px',
  justifyContent: 'center',
}));

const StyledDataGrid = styled(DataGrid)({
  border: 'none',
  width: '100%',
  '& .MuiDataGrid-main': {
    border: '1px solid #E8E8E8',
    borderRadius: '0 0 4px 4px',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#E8E8E8',
    borderRadius: 0,
  },
  '& .MuiDataGrid-footerContainer': {
    border: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
