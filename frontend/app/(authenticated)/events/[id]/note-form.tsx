"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/queries/category";

const noteFormSchema = z.object({
  content: z.string(),
  category_id: z.string().optional(),
});

export type NoteFormType = z.infer<typeof noteFormSchema>;

const noteFormDefault = {
  content: "",
  category_id: undefined,
};

type Props = {
  onSubmit: SubmitHandler<NoteFormType>;
  hideCategory?: boolean;
};

const NoteForm = ({ onSubmit, hideCategory }: Props) => {
  const form = useForm<NoteFormType>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: noteFormDefault,
  });

  const { data: categories } = useQuery(getCategories());

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Box className="flex flex-col space-y-2.5">
            <FormField
              control={form.control}
              name={"content"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-current">Content</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          {!hideCategory && categories && (
            <Box className="flex flex-col space-y-2.5">
              <FormField
                control={form.control}
                name={"category_id"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-current">Category</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NoteForm;
