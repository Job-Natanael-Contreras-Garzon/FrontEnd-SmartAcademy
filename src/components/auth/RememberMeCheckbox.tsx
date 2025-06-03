import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Checkbox para la opción "Recordar sesión" en el formulario de login
 */
const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary"
          size="small"
        />
      }
      label="Recordar sesión"
    />
  );
};

export default RememberMeCheckbox;
