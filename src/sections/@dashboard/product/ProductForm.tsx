import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
// routes
import axios from '@/utils/axios';

// @types
import { IProduct, IProductBrand, IProductCountry, IProductPhoto } from '@/@types/product';
// components
import { CustomFile } from '@/components/upload';
import FormProvider, {
  RHFSwitch,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFUploadAvatar,
} from '@/components/hook-form';
import { ICategory } from '@/@types/category';
import { fData } from '@/utils/formatNumber';
import { uploadFile, uploadFiles } from '@/components/file-thumbnail/utils';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IProduct, 'photos' | 'photo'> {
  taxes: boolean;
  inStock: boolean;
  photos: (CustomFile | IProductPhoto)[];
  photo: CustomFile | IProductPhoto;
}

type Props = {
  isEdit?: boolean;
  currentProduct: IProduct | null;
  submitForm: Function;
};

export default function ProductForm({ isEdit, currentProduct, submitForm }: Props) {
  console.log('CUREWNT', currentProduct);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().required('Slug is required'),
    price: Yup.number().moreThan(0, 'Price should not be 0đ'),
    priceSale: Yup.number().lessThan(Yup.ref('price')),
    description: Yup.string().required('Description is required'),
    introduction: Yup.string()
      .required('Description is required')
      .max(300, 'Introduction must not be longer than 300 characters'),
  });

  const [brands, setBrands] = useState<IProductBrand[]>([]);
  const [countries, setCountries] = useState<IProductCountry[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      slug: currentProduct?.slug,
      description: currentProduct?.description || '',
      introduction: currentProduct?.introduction || '',
      photos: currentProduct?.photos || [],
      barCode: currentProduct?.barCode || '',
      category: currentProduct?.category || null,
      country: currentProduct?.country || null,
      brand: currentProduct?.brand || null,
      photo: currentProduct?.photo,
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,

      inStock: true,
      taxes: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const getData = async () => {
    const brandsPromise = axios.get('/api/v1/brands');
    const countriesPromise = axios.get('/api/v1/countries');
    const categoriesPromise = axios.get('/api/v1/categories');
    try {
      const dataReponse = await Promise.all([brandsPromise, countriesPromise, categoriesPromise]);
      setBrands(dataReponse[0].data.data);
      setCountries(dataReponse[1].data.data);
      setCategories(dataReponse[2].data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isEdit && currentProduct) {
      console.log('CURRRENT', defaultValues);

      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data: ICategory) => {
    submitForm(data);
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      const filesUpload = await uploadFiles(files);
      if (filesUpload) {
        const photos = [...values.photos, ...filesUpload];
        setValue('photos', photos, { shouldValidate: true });
      }
    },
    [setValue, values.photos]
  );
  const handleDropPhoto = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      // const newFile = Object.assign(file, {
      //   preview: URL.createObjectURL(file),
      // });
      const fileUpload = await uploadFile(file);
      if (fileUpload) {
        setValue('photo', fileUpload, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const uploadPhotos = () => {
    console.log('UPLOAD', values.photos);
  };
  const handleRemoveFile = (inputFile: CustomFile | IProductPhoto) => {
    const filtered = values.photos && values.photos?.filter((file) => file.path !== inputFile.path);
    setValue('photos', filtered);
  };

  const handleRemoveAllFiles = () => {
    const photos: CustomFile[] | IProductPhoto[] = [];
    setValue('photos', photos);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên sản phẩm" />
              <RHFTextField name="slug" label="Slug" />
              <RHFTextField multiline rows={4} name="introduction" label="Intro" />
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Mô tả
                </Typography>

                <RHFEditor simple name="description" />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  photos
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="photos"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  // onUpload={uploadPhotos}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar
                  name="photo"
                  maxSize={3145728}
                  onDrop={handleDropPhoto}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>
              <RHFSwitch name="inStock" label="In stock" />

              <Stack spacing={3} mt={2}>
                <RHFTextField name="barCode" label="Product Code" />
                <RHFTextField name="sku" label="Product SKU" />

                <RHFAutocomplete
                  name="brand"
                  label="Brand"
                  options={brands}
                  getOptionLabel={(option: IProductBrand | string) =>
                    (option as IProductBrand).name
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  options={countries}
                  getOptionLabel={(option: IProductCountry | string) =>
                    (option as IProductCountry).name
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />

                <RHFAutocomplete
                  name="category"
                  label="Category"
                  options={categories}
                  getOptionLabel={(option: ICategory | string) => (option as ICategory).name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField type="number" name="quantity" label="Quantity" />
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0"
                  onChange={(event) =>
                    setValue('price', Number(event.target.value), { shouldValidate: true })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          đ
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0"
                  onChange={(event) => setValue('priceSale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          đ
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="taxes" label="Price includes taxes" />
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
