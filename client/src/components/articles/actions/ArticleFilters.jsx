import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import useArticlePermissions from '@/hooks/useArticlePermissions';

export const ArticleFilters = ({ userId, selectedPurposes, handlePurposeChange }) => {
  const { purposes, canReadPurposes: allowedPurposes, isLoading } = useArticlePermissions(userId);

  const purposeChoices = allowedPurposes.map(p => p.name);

  const handleToggle = (event, newPurposes) => {
    if (newPurposes.length === 0) {
      handlePurposeChange([]);
    } else if (newPurposes[0] === 'Show All' && newPurposes.length > 1) {
      const filteredPurposes = newPurposes.filter(purpose => purpose !== 'Show All');
      handlePurposeChange(filteredPurposes);
    } else {
      handlePurposeChange(newPurposes);
    }
  };

  return (
    <Grid item xs={4} md={4} sx={{ pt: 2, pb: 2 }}>
      <ToggleButtonGroup
        color='primary'
        value={selectedPurposes}
        onChange={handleToggle}
        aria-label='purpose'
        size='small'
        sx={{ ml: 4 }}>
        <ToggleButton value='Show All' aria-label='Show All' className='button-4'>
          Show All
        </ToggleButton>
        {purposeChoices.map(purpose => (
          <ToggleButton
            key={purpose}
            value={purpose}
            aria-label={purpose}
            sx={{ textTransform: 'none', fontFamily: 'Inter' }}>
            {purpose}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};
