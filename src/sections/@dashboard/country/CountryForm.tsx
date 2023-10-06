import { ICategory } from '@/@types/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Card, Grid, Stack, Typography } from '@mui/material';
import FormProvider, { RHFEditor, RHFTextField } from '@/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { IProductCountry } from '@/@types/product';

type Props = {
  isEdit?: boolean;
  currentCountry: IProductCountry | null;
  submitForm: Function;
};

export default function CountryForm({ isEdit, currentCountry, submitForm }: Props) {
  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Slug is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCountry?.name || '',
      code: currentCountry?.code || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCountry]
  );

  const methods = useForm<ICategory>({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ICategory) => {
    submitForm(data);
  };

  useEffect(() => {
    if (isEdit && currentCountry) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCountry]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField sx={{ display: 'none' }} disabled name="id" label="Id" />
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="code" label="Code" />
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Mô tả
                </Typography>

                <RHFEditor simple name="description" />
              </Stack>
            </Stack>
          </Card>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!isEdit ? 'Thêm mới' : 'Lưu lại'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
