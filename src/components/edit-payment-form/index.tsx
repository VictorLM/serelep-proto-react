import React, {
  ReactElement, SyntheticEvent, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import isDate from 'validator/lib/isDate';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';
import { UpdatePayment } from '../../types/payment.type';
import { getPaymentByID, updatePayment } from '../../api/payments';

type EditPaymentParams = {
  id: string;
};

export const EditPaymentForm: React.FC = (): ReactElement => {
  const [notes, setNotes] = useState('');
  const [payed, setPayed] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<EditPaymentParams>();

  function cleanForm(): void {
    setNotes('');
    setPayed('');
    setDueDate('');
    setValue(0);
  }

  async function handleUpdatePayment(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    let formErrors = false;
    if (notes) {
      if (notes.length < 3 || notes.length > 255) {
        formErrors = true;
        toast.error('Anotações devem ter entre 3 e 255 caracteres');
      }
    }

    if (payed) {
      if (!isDate(payed)) {
        formErrors = true;
        toast.error('Data do pagamento inválida');
        return;
      }
    }

    if (!isDate(dueDate)) {
      formErrors = true;
      toast.error('Data do vencimento inválida');
      return;
    }

    if (Number.isNaN(value) || Math.sign(Number(value)) === -1) {
      toast.error('Valor inválido');
      return;
    }

    if (!formErrors) {
      setLoading(true);
      const updatedPayment: UpdatePayment = {
        notes, dueDate, value,
      };
      if (payed) updatedPayment.payed = payed;
      const result = await updatePayment(id, updatedPayment);
      setLoading(false);
      if (result) {
        toast.success('Pagamento editado com sucesso');
        cleanForm();
        history.push(`/pagamentos/${id}`);
      }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundPayment = await getPaymentByID(id);

      if (!foundPayment) {
        toast.error('Erro ao carregar as informações do Pagamento');
        setLoading(false);
        history.push('/pagamentos');
      } else {
        setNotes(foundPayment.notes || '');
        if (foundPayment.payed) setPayed(foundPayment.payed.toISOString().substr(0, 10));
        setDueDate(foundPayment.dueDate.toISOString().substr(0, 10));
        setValue(foundPayment.value);
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Editar Pagamento"
          subtitle="Edite as informações deste Pagamento"
          addButton={false}
        />

        <div className={`card card-white w-50 ${styles.card_white}`}>

          {loading ? <Loader />
            : (

              <form className="form-inline" onSubmit={(e) => handleUpdatePayment(e)}>

                <p style={{ fontWeight: 300 }}>
                  {`ID ${id}`}
                </p>

                <label htmlFor="value">
                  <span>Valor (R$)</span>
                  <input
                    type="number"
                    name="value"
                    placeholder="Valor"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                  />
                </label>

                <label htmlFor="dueDate">
                  <span>Vencimento</span>
                  <input
                    type="date"
                    name="dueDate"
                    placeholder="Vencimento"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </label>

                <label htmlFor="payed">
                  <span>Pago em</span>
                  <input
                    type="date"
                    name="payed"
                    placeholder="Pago em"
                    value={payed}
                    onChange={(e) => setPayed(e.target.value)}
                  />
                </label>

                <label htmlFor="notes">
                  <span>Anotações</span>
                  <textarea
                    name="notes"
                    placeholder="Anotações"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>

                <button type="submit" className="create-btn">
                  Editar Pagamento
                </button>
              </form>

            )}

        </div>

      </div>
      <Footer />
    </section>
  );
};
