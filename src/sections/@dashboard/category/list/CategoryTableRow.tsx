import { useState } from 'react';
import NextLink from 'next/link';
// @mui
import { Button, TableRow, Checkbox, MenuItem, TableCell, IconButton, Link } from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// @types
import { IProduct } from '@/@types/product';
// components
import Iconify from '@/components/iconify';
import ConfirmDialog from '@/components/confirm-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IProduct;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CategoryTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const { createdAt, slug, name, id } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const handleDeleteRow = () => {
    onDeleteRow();
    setOpenConfirm(false);
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox size="small" checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell align="center">{slug}</TableCell>

        <TableCell>{fDate(createdAt)}</TableCell>

        <TableCell align="center">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Link color="inherit" href={`/dashboard/category/edit/${id}`} component={NextLink}>
              <Iconify icon="solar:pen-bold" />
            </Link>
          </IconButton>
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenConfirm}>
            <Iconify icon="solar:trash-bin-trash-bold-duotone" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
