import { sentenceCase } from 'change-case';
// @mui
import {
  Stack,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// components
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filter: string[];
  filterOptions: {
    value: string;
    label: string;
  }[];
  onFilter: (event: SelectChangeEvent<string[]>) => void;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CountryTableToolbar({
  filterName,
  filter,
  onFilterName,
  filterOptions,
  onFilter,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="solar:magnifer-line-duotone"
                sx={{ color: 'text.disabled', width: '24', height: '24' }}
              />
            </InputAdornment>
          ),
        }}
      />
      <FormControl
        sx={{
          width: { xs: 1, md: 240 },
        }}
      >
        <InputLabel sx={{ '&.Mui-focused': { color: 'text.primary' } }}>Filter By</InputLabel>
        <Select
          multiple
          value={filter}
          onChange={onFilter}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.map((value) => sentenceCase(value)).join(', ')}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                p: 0,
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              <Checkbox size="small" checked={filter.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
