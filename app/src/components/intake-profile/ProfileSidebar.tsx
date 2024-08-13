import {Stack, Typography} from '@mui/material';
import {Dispatch, SetStateAction} from 'react';
import {SidebarButton} from './SidebarButton';

type FieldGroup = {
  id: string;
  title: string;
};

interface ProfileSidebarProps {
  fieldGroups: FieldGroup[];
  handleSectionClick: () => void;
  setSelectedItem: Dispatch<SetStateAction<string | null>>;
  groupId: string | undefined;
}

export const ProfileSidebar = ({
  fieldGroups,
  handleSectionClick,
  setSelectedItem,
  groupId,
}: ProfileSidebarProps) => {
  const totalTask = fieldGroups.length - 1;

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    handleSectionClick();
  };

  return (
    <>
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
        const status = 'incomplete'; // Change status here to see different styles
        // complete | partial | incomplete | locked
        const fieldTitle = title || '...';
        return (
          <SidebarButton
            key={id}
            fieldTitle={fieldTitle}
            groupId={groupId}
            handleClick={handleItemClick}
            id={id}
            status={status}
          />
        );
      })}
    </>
  );
};
