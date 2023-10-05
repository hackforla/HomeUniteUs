import {useState} from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Pagination,
  Stack,
} from '@mui/material';
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
  {field: 'applicant', headerName: 'Applicant', flex: 1},
  {field: 'type', headerName: 'Type', flex: 1},
  {field: 'status', headerName: 'Status', flex: 1},
  {field: 'coordinator', headerName: 'Coordinator', flex: 1},
  {field: 'updated', headerName: 'Updated', flex: 1},
  {
    field: 'notes',
    headerName: 'Notes',
    editable: true,
    resizable: true,
    flex: 1,
  },
];

function a11yProps(index: number) {
  return {
    id: `dashboard-tabs-${index}`,
    'aria-controls': `dashboard-2-${index}`,
  };
}

export const CoordinatorDashboardNew = () => {
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
    <Container sx={{my: 6}}>
      <Typography variant="h1" sx={{fontSize: 36, fontWeight: 'bold', mb: 4.5}}>
        Dashboard
      </Typography>
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
        rows={data}
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
        }}
      />
    </Container>
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

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

const StyledTab = styled(Tab)(({theme}) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(24),
  color: theme.palette.text.secondary,
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
