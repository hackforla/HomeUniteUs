import {Stack, Typography} from '@mui/material';
import {Dispatch, SetStateAction} from 'react';
import {SidebarButton} from './SidebarButton';
import {FieldGroup} from 'src/services/profile';

interface ProfileSidebarProps {
  fieldGroups: FieldGroup[];
  groupId: string | undefined;
  isReviewPage: boolean;
  toggleShowSections: () => void;
  setSelectedItem: Dispatch<SetStateAction<string | null>>;
  showSections: boolean;
}

export const ProfileSidebar = ({
  fieldGroups,
  groupId,
  isReviewPage,
  setSelectedItem,
  showSections,
  toggleShowSections,
}: ProfileSidebarProps) => {
  const totalTask = fieldGroups.length - 1;

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    toggleShowSections();
  };

  return (
    <Stack
      sx={{
        gap: 1,
        width: {xs: '100%', sm: '100%', md: '412px'},
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'inherit',
        padding: '12px',
        display: {xs: showSections ? 'flex' : 'none', md: 'flex'},
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '35px 35px 0px 0px',
        }}
      >
        <Typography sx={{fontSize: 18, fontWeight: 'medium', marginBottom: 1}}>
          Profile Sections
        </Typography>
        <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
          {0 /* needs to be implemented*/} of {totalTask}
        </Typography>
      </Stack>
      {fieldGroups.map(({id, title}) => {
        // Change status here to see different styles
        // complete | partial | incomplete | locked
        const status = 'incomplete';
        const fieldTitle = title || '...';

        return (
          <SidebarButton
            key={id}
            fieldTitle={fieldTitle}
            handleClick={() => handleItemClick(id)}
            isActive={groupId === id}
            status={status}
            to={`group/${id}`}
          />
        );
      })}
      <SidebarButton
        fieldTitle="Review"
        to={'review'}
        status={'incomplete'}
        isActive={isReviewPage}
      />
    </Stack>
  );
};
