// import { paramCase } from 'change-case';
// import { useState, useEffect } from 'react';
// // next
// import Head from 'next/head';
// import NextLink from 'next/link';
// import { useRouter } from 'next/router';
// // @mui
// import {
//   Card,
//   Table,
//   Button,
//   Tooltip,
//   TableBody,
//   Container,
//   IconButton,
//   TableContainer,
// } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material/Select';
// // redux
// import { useDispatch, useSelector } from '@/redux/store';
// import { getProducts } from '@/redux/slices/product';
// // routes
// import { PATH_DASHBOARD } from '@/routes/paths';
// // @types
// import { IProduct } from '@/@types/product';
// // layouts
// import DashboardLayout from '@/layouts/dashboard';
// // components
// import { useSettingsContext } from '@/components/settings';
// import {
//   useTable,
//   getComparator,
//   emptyRows,
//   TableNoData,
//   TableSkeleton,
//   TableEmptyRows,
//   TableHeadCustom,
//   TableSelectedAction,
//   TablePaginationCustom,
// } from '@/components/table';
// import Iconify from '@/components/iconify';
// import Scrollbar from '@/components/scrollbar';
// import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
// import ConfirmDialog from '@/components/confirm-dialog';
// // sections
// import { ProductTableRow, ProductTableToolbar } from '@/sections/@dashboard/e-commerce/list';
// import axios from '@/utils/axios';

// // ----------------------------------------------------------------------

// type TableHead = any[];
// type TableProps = { path: string; tableHead: TableHead };
// const STATUS_OPTIONS = [
//   { value: 'in_stock', label: 'In stock' },
//   { value: 'low_stock', label: 'Low stock' },
//   { value: 'out_of_stock', label: 'Out of stock' },
// ];

// // ----------------------------------------------------------------------

// EcommerceProductListPage.getLayout = (page: React.ReactElement) => (
//   <DashboardLayout>{page}</DashboardLayout>
// );

// // ----------------------------------------------------------------------

// export default function EcommerceProductListPage({ tableHead, path }: TableProps) {
//   const {
//     dense,
//     page,
//     order,
//     orderBy,
//     rowsPerPage,
//     setPage,
//     //
//     selected,
//     setSelected,
//     onSelectRow,
//     onSelectAllRows,
//     //
//     onSort,
//     onChangeDense,
//     onChangePage,
//     onChangeRowsPerPage,
//   } = useTable({
//     defaultOrderBy: 'createdAt',
//   });

//   const { themeStretch } = useSettingsContext();

//   const { push } = useRouter();

//   const [loading, setLoading] = useState<boolean>(true);

//   const [tableData, setTableData] = useState<any[]>([]);

//   const [filterName, setFilterName] = useState('');

//   const [filterStatus, setFilterStatus] = useState<string[]>([]);

//   const [openConfirm, setOpenConfirm] = useState(false);

//   async function getData() {
//     setLoading(true);
//     try {
//       const respon = await axios.get(`${path}?page=${page + 1}&limit=${rowsPerPage}`);
//       setTableData(respon.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.log('errot', error);
//     }
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     getData();
//   }, [page, rowsPerPage]);

//   const denseHeight = dense ? 60 : 80;

//   const isFiltered = filterName !== '' || !!filterStatus.length;

//   const isNotFound = !!filterName || !loading;

//   const handleOpenConfirm = () => {
//     setOpenConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setOpenConfirm(false);
//   };

//   const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const handleFilterStatus = (event: SelectChangeEvent<string[]>) => {
//     const {
//       target: { value },
//     } = event;
//     setPage(0);
//     setFilterStatus(typeof value === 'string' ? value.split(',') : value);
//   };

//   const handleDeleteRow = (id: string) => {};

//   const handleDeleteRows = (selectedRows: string[]) => {};

//   const handleEditRow = (id: string) => {
//     push(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
//   };

//   const handleViewRow = (id: string) => {
//     push(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
//   };

//   const handleResetFilter = () => {
//     setFilterName('');
//     setFilterStatus([]);
//   };

//   return (
//     <>
//       <Head>
//         <title> Ecommerce: Product List | Minimal UI</title>
//       </Head>

//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <CustomBreadcrumbs
//           heading="Product List"
//           links={[
//             { name: 'Dashboard', href: PATH_DASHBOARD.root },
//             {
//               name: 'E-Commerce',
//               href: PATH_DASHBOARD.eCommerce.root,
//             },
//             { name: 'List' },
//           ]}
//           action={
//             <Button
//               component={NextLink}
//               href={PATH_DASHBOARD.eCommerce.new}
//               variant="contained"
//               startIcon={<Iconify icon="eva:plus-fill" />}
//             >
//               New Product
//             </Button>
//           }
//         />

//         <Card>
//           <ProductTableToolbar
//             filterName={filterName}
//             filterStatus={filterStatus}
//             onFilterName={handleFilterName}
//             onFilterStatus={handleFilterStatus}
//             statusOptions={STATUS_OPTIONS}
//             isFiltered={isFiltered}
//             onResetFilter={handleResetFilter}
//           />

//           <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
//             <TableSelectedAction
//               dense={dense}
//               numSelected={selected.length}
//               rowCount={tableData.length}
//               onSelectAllRows={(checked) =>
//                 onSelectAllRows(
//                   checked,
//                   tableData.map((row) => row.id)
//                 )
//               }
//               action={
//                 <Tooltip title="Delete">
//                   <IconButton color="primary" onClick={handleOpenConfirm}>
//                     <Iconify icon="eva:trash-2-outline" />
//                   </IconButton>
//                 </Tooltip>
//               }
//             />

//             <Scrollbar>
//               <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
//                 <TableHeadCustom
//                   order={order}
//                   orderBy={orderBy}
//                   headLabel={tableHead}
//                   rowCount={tableData.length}
//                   numSelected={selected.length}
//                   onSort={onSort}
//                   onSelectAllRows={(checked) =>
//                     onSelectAllRows(
//                       checked,
//                       tableData.map((row) => row.id)
//                     )
//                   }
//                 />

//                 <TableBody>
//                   {(loading ? [...Array(rowsPerPage)] : tableData).map((row, index) =>
//                     row ? (
//                       <ProductTableRow
//                         key={row.id}
//                         row={row}
//                         selected={selected.includes(row.id)}
//                         onSelectRow={() => onSelectRow(row.id)}
//                         onDeleteRow={() => handleDeleteRow(row.id)}
//                         onEditRow={() => handleEditRow(row.name)}
//                         onViewRow={() => handleViewRow(row.name)}
//                       />
//                     ) : (
//                       !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
//                     )
//                   )}

//                   <TableEmptyRows
//                     height={denseHeight}
//                     emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
//                   />

//                   <TableNoData isNotFound={isNotFound} />
//                 </TableBody>
//               </Table>
//             </Scrollbar>
//           </TableContainer>

//           <TablePaginationCustom
//             count={tableData.length}
//             page={page}
//             rowsPerPage={rowsPerPage}
//             onPageChange={onChangePage}
//             onRowsPerPageChange={onChangeRowsPerPage}
//             //
//             dense={dense}
//             onChangeDense={onChangeDense}
//           />
//         </Card>
//       </Container>

//       <ConfirmDialog
//         open={openConfirm}
//         onClose={handleCloseConfirm}
//         title="Delete"
//         content={
//           <>
//             Are you sure want to delete <strong> {selected.length} </strong> items?
//           </>
//         }
//         action={
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               handleDeleteRows(selected);
//               handleCloseConfirm();
//             }}
//           >
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }

// // ----------------------------------------------------------------------
