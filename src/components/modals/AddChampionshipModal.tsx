"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ensure this file exists at the specified path or update the path to the correct location.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChampionshipFormValues } from "@/types/championship";

const championshipSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  format: z.enum(["single_elimination", "double_elimination"], {
    required_error: "Formato é obrigatório",
  }),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de fim é obrigatória"),
  location: z.string().min(1, "Localização é obrigatória"),
  status: z.enum(["upcoming", "ongoing", "completed", "planned"], {
    required_error: "Status é obrigatório",
  }),
  prize: z.union([z.string(), z.number()]).refine(
    (val) => {
      if (typeof val === "string") {
        return val.trim().length > 0;
      }
      return val > 0;
    },
    { message: "Premiação é obrigatória" }
  ),
}).refine(
  (data) => new Date(data.start_date) < new Date(data.end_date),
  {
    message: "Data de início deve ser anterior à data de fim",
    path: ["end_date"],
  }
);

interface AddChampionshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChampionshipFormValues) => Promise<void>;
  defaultValues?: Partial<ChampionshipFormValues>;
  isLoading?: boolean;
}

export const AddChampionshipModal: React.FC<AddChampionshipModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isLoading = false,
}) => {
  const isEditing = !!defaultValues?.championship_id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ChampionshipFormValues>({
    resolver: zodResolver(championshipSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      format: "single_elimination",
      start_date: "",
      end_date: "",
      location: "",
      status: "planned",
      prize: "",
    },
  });

  const format = watch("format");
  const status = watch("status");

  React.useEffect(() => {
    if (isOpen && defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof ChampionshipFormValues, value);
      });
    } else if (isOpen && !defaultValues) {
      reset({
        name: "",
        description: "",
        format: "single_elimination",
        start_date: "",
        end_date: "",
        location: "",
        status: "planned",
        prize: "",
      });
    }
  }, [isOpen, defaultValues, setValue, reset]);

  const handleFormSubmit = async (data: ChampionshipFormValues) => {
    await onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const formatOptions = [
    { value: "single_elimination", label: "Eliminação Simples" },
    { value: "double_elimination", label: "Eliminação Dupla" },
  ];

  const statusOptions = [
    { value: "planned", label: "Planejado" },
    { value: "upcoming", label: "Próximo" },
    { value: "ongoing", label: "Em Andamento" },
    { value: "completed", label: "Finalizado" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Editar Campeonato" : "Criar Novo Campeonato"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome do Campeonato *
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Ex: Campeonato Brasileiro 2024"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Localização *
              </Label>
              <Input
                id="location"
                {...register("location")}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Ex: São Paulo, SP"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Descrição do campeonato..."
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Formato *</Label>
              <Select
                value={format}
                onValueChange={(value) => setValue("format", value as any)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {formatOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.format && (
                <p className="text-red-500 text-sm">{errors.format.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white">Status *</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-gray-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-white">
                Data de Início *
              </Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">{errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-white">
                Data de Fim *
              </Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
                className="bg-gray-800 border-gray-600 text-white"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prize" className="text-white">
              Premiação *
            </Label>
            <Input
              id="prize"
              {...register("prize")}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Ex: R$ 10.000,00 ou 10000"
            />
            {errors.prize && (
              <p className="text-red-500 text-sm">{errors.prize.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-600 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Criar Campeonato"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
