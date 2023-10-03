import {useState} from 'react';
import {Container, Box, Tabs, Tab} from '@mui/material';
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid';
import {faker} from '@faker-js/faker';

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
    notes: faker.lorem.sentence(),
  };
};
const rows: GridRowsProp = Array.from(Array(10), () => buildRow());

const columns: GridColDef[] = [
  {field: 'applicant', headerName: 'Applicant', flex: 1},
  {field: 'type', headerName: 'Type', flex: 1},
  {field: 'status', headerName: 'Status', flex: 1},
  {field: 'coordinator', headerName: 'Coordinator', flex: 1},
  {field: 'updated', headerName: 'Updated', flex: 1},
  {field: 'notes', headerName: 'Notes', flex: 1},
];

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const CoordinatorDashboardNew = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container sx={{mt: 6}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label={`All ${rows.length}`} {...a11yProps(0)} />
          <Tab
            label={`Guests ${rows.filter(row => row.type === 'Guest').length}`}
            {...a11yProps(1)}
          />
          <Tab
            label={`Hosts ${rows.filter(row => row.type === 'Host').length}`}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        rows={rows}
        columns={columns}
      />
    </Container>
  );
};
