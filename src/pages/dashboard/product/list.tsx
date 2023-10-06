import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// redux
// routes
import { PATH_DASHBOARD } from '@/routes/paths';

// layouts
import DashboardLayout from '@/layouts/dashboard';
// components
import { useSettingsContext } from '@/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '@/components/table';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import ConfirmDialog from '@/components/confirm-dialog';
// sections

import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { IProductBrand } from '@/@types/product';
import { useLocales } from '@/locales';
import ProductTableToolbar from '@/sections/@dashboard/product/list/ProductTableToolbar';
import ProductTableRow from '@/sections/@dashboard/product/list/ProductTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'slug', label: 'Slug', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'createdAt', label: 'Create at', align: 'left' },
  { id: '', label: 'Action', align: 'center' },
];
const FILTER_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'slug', label: 'Slug' },
  { value: 'price', label: 'Price' },
];

// ----------------------------------------------------------------------

ProductListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProductListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
    defaultDense: true,
  });

  const { translate } = useLocales();
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(true);

  const [tableData, setTableData] = useState<IProductBrand[]>([]);

  const [filterName, setFilterName] = useState('');

  const [filter, setFilter] = useState<string[]>(['name']);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [refesh, setRefresh] = useState(false);
  const [count, setCount] = useState(0);

  const getData = async () => {
    setLoading(true);
    const filterEncode = encodeURIComponent(JSON.stringify(filter));
    const params = filterName
      ? `page=${page + 1}&limit=${rowsPerPage}&search=${filterName}&filter=${filterEncode}`
      : `page=${page + 1}&limit=${rowsPerPage}`;
    try {
      const respon = await axios.get(`/api/v1/products?${params}`);
      setTableData(respon.data.data);
      setCount(respon.data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, refesh]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filterName]);

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !!filterName || !loading;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilter = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    if (value?.length === 0) return null;

    setFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      await axios.delete(`/api/v1/products/${id}`);
      enqueueSnackbar(translate('notification.delete.success'));
      const data = tableData.filter((item) => item.id !== id);
      setTableData(data);
      setSelected(selected.filter((item) => item !== id));
    } catch (error) {
      console.log(error);
      enqueueSnackbar(translate('notification.error'), { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows: string[]) => {
    try {
      await axios.delete(`/api/v1/products/delete`, { data: selectedRows });
      enqueueSnackbar(translate('notification.delete.success'));
      setSelected([]);
      setRefresh(!refesh);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(translate('notification.error'), { variant: 'error' });
    }
  };

  return (
    <>
      <Head>
        <title> Ecommerce: Product List | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Brand List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.country.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.country.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Brand
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar
            filterName={filterName}
            filter={filter}
            onFilterName={handleFilterName}
            onFilter={handleFilter}
            filterOptions={FILTER_OPTIONS}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton size="small" color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="solar:trash-bin-trash-bold-duotone" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(loading ? [...Array(rowsPerPage)] : tableData).map((row, index) =>
                    row ? (
                      <ProductTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, count)}
                  />

                  {tableData.length === 0 && <TableNoData isNotFound={isNotFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
