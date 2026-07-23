import { toast } from "sonner";

export function notifyInterfaceOnly() {
  toast("Modo de interface: integracao pendente.", {
    description: "Nenhum dado foi salvo. Conecte a API para persistir informacoes.",
  });
}

