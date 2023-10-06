import { ICategory } from '@/@types/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import FormProvider, { RHFEditor, RHFTextField, RHFUploadAvatar } from '@/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { IProductBrand, IProductPhoto } from '@/@types/product';
import { fData } from '@/utils/formatNumber';
import { uploadFile } from '@/components/file-thumbnail';
import { CustomFile } from '@/components/upload';

type Props = {
  isEdit?: boolean;
  currentBrand: IProductBrand | null;
  submitForm: Function;
};

interface FormValuesProps extends Omit<IProductBrand, 'photo'> {
  photo: CustomFile | IProductPhoto;
}
export default function CategoryForm({ isEdit, currentBrand, submitForm }: Props) {
  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().required('Slug is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentBrand?.name || '',
      description: currentBrand?.description || '',
      slug: currentBrand?.slug || '',
      site: currentBrand?.site || '',
      id: currentBrand?.id,
      phone: currentBrand?.phone || '',
      photo: currentBrand?.photo,
      mail: currentBrand?.mail || '',
      fax: currentBrand?.fax || '',
      address: currentBrand?.address || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBrand]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ICategory) => {
    submitForm(data);
  };
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
  useEffect(() => {
    if (isEdit && currentBrand) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBrand]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
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
            </Stack>{' '}
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField sx={{ display: 'none' }} disabled name="id" label="Id" />
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="slug" label="Slug" />
              <RHFTextField name="site" label="Website" />
              <RHFTextField name="fax" label="Fax" />
              <RHFTextField name="mail" label="E-mail" />
              <RHFTextField name="phone" label="Phone" />
              <RHFTextField name="address" label="Address" />
            </Box>
            <Stack sx={{ pt: 2 }} spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Mô tả
              </Typography>

              <RHFEditor simple name="description" />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Brand' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
