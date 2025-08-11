import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { ChatConfig, ConfigField } from "./types";

type ConfigModalProps = {
  open: boolean;
  onClose: () => void;
  config?: ChatConfig;
  onSave: (config: ChatConfig) => void;
};

export default function ConfigModal({
  open,
  onClose,
  config,
  onSave,
}: ConfigModalProps) {
  const [fields, setFields] = useState<ConfigField[]>(
    config?.fields?.length
      ? config.fields
      : [{ key: "", value: "", encrypted: false }]
  );

  useEffect(() => {
    setFields(
      config?.fields?.length
        ? config.fields
        : [{ key: "", value: "", encrypted: false }]
    );
  }, [config, open]);

  function handleFieldChange(
    idx: number,
    prop: keyof ConfigField,
    val: string | boolean
  ) {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [prop]: val } : f))
    );
  }

  function handleAdd() {
    setFields((prev) => [...prev, { key: "", value: "", encrypted: false }]);
  }

  function handleRemove(idx: number) {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    onSave({ fields });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button className="bg-green-600 text-white" onClick={handleSave}>
            <Save />
            Salvar
          </Button>
        </>
      }
    >
      <h2 className="text-xl font-bold mb-4">Configurações</h2>

      <div className="flex flex-col gap-2">
        {fields.map((field, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              placeholder="Chave"
              value={field.key}
              onChange={(e) => handleFieldChange(idx, "key", e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Valor"
              value={field.value}
              type={field.encrypted ? "password" : "text"}
              onChange={(e) => handleFieldChange(idx, "value", e.target.value)}
              className="w-56"
            />
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={field.encrypted}
                onChange={(e) =>
                  handleFieldChange(idx, "encrypted", e.target.checked)
                }
                id={`encrypt-field-${idx}`}
              />
              <label
                htmlFor={`encrypt-field-${idx}`}
                className="select-none text-sm"
              >
                Usa criptografia
              </label>
            </div>
            <Button
              className="bg-red-500 text-white px-2"
              onClick={() => handleRemove(idx)}
              disabled={fields.length === 1}
              type="button"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          className="mt-2 bg-blue-600 text-white"
          onClick={handleAdd}
          type="button"
        >
          <Plus />
          Adicionar
        </Button>
      </div>
    </Modal>
  );
}
