import { get } from 'lodash';
import { toast } from 'react-toastify';

export function catchBlock(error: unknown): void {
  console.log(error);
  let errors = { message: ['Erro ao processar operação. Por favor, tente novamente mais tarde'] };

  if (get(error, 'response', null)) {
    // HOUVE RESPOSTA COM ERROR CODE
    errors.message = (get(error, 'response.data.message', null)) && (get(error, 'response.data.message', null));
  } else if (get(error, 'request', null)) {
    // NÃO HOUVE RESPOSTA
    errors = { message: ['Nossos servidores não estão respondendo. Por favor, tente novamente mais tarde'] };
  }

  if (Array.isArray(errors.message)) {
    errors.message.map((errorMessage) => toast.error(errorMessage));
  } else if (typeof errors.message === 'string') {
    toast.error(errors.message);
  } else {
    toast.error('Erro ao processar operação. Por favor, tente novamente mais tarde');
  }
}
