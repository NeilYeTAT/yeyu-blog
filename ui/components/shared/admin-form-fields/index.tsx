'use client'

import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Switch } from '@/ui/shadcn/switch'

export function PublishedFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
>({ control, name }: { control: Control<TFieldValues>; name: TName }) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg">是否发布</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={checked => {
                field.onChange(checked)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function ReferenceFormField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({ control, name }: { control: Control<TFieldValues>; name: TName }) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>来源</FormLabel>
          <FormControl>
            <Input placeholder="请输入来源" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
