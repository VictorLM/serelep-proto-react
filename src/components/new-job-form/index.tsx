import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import isDate from 'validator/lib/isDate';
import { sumBy } from 'lodash';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';
import { NewPayment } from '../../types/payment.type';
import { NewJob } from '../../types/job.type';
import { createJob } from '../../api/jobs';
import { Customer } from '../../types/customer.type';
import { getCustomers } from '../../api/customer';

export const NewJobForm: React.FC = (): ReactElement => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState(['']);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [payments, setPayments] = useState<NewPayment[]>([]);
  const [paymentValue, setPaymentValue] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [customers, setCustomers] = useState<Customer[]>();
  const [loading, setLoading] = useState(false);

  function cleanForm(): void {
    setName('');
    setTypes(['']);
    setCustomer('');
    setDescription('');
    setPayments([]);
    setPaymentValue('');
    setPaymentDueDate('');
  }

  function handleAddPayment(): void {
    if (!isDate(paymentDueDate)) {
      toast.error('Data da parcela inválida');
      return;
    }

    if (Number.isNaN(paymentValue) || Math.sign(Number(paymentValue)) === -1) {
      toast.error('Valor da parcela inválido');
      return;
    }

    const newPayment: NewPayment = {
      value: Number(paymentValue),
      dueDate: paymentDueDate,
    };

    const tempPayments = [...payments];
    tempPayments.push(newPayment);
    setPayments(tempPayments);
    setPaymentDueDate('');
    // TODO - BOTÃO LIMPAR PAGAMENTOS PARA RESETAR
  }

  function cleanPayments(): void {
    setPayments([]);
    setPaymentValue('');
    setPaymentDueDate('');
  }

  async function handleCreateJob(): Promise<void> {
    // VALIDANDO FORM
    let formErrors = false;
    if (name.length < 3 || name.length > 50) {
      formErrors = true;
      toast.error('Nome deve ter entre 3 e 50 caracteres');
      return;
    }

    if (types.length < 1 || types.length > 4) {
      formErrors = true;
      toast.error('Selecione entre 1 e 4 Tipos');
      return;
    }

    if (!customer) {
      formErrors = true;
      toast.error('Cliente inválido.');
    }

    if (description) {
      if (description.length < 3 || description.length > 255) {
        formErrors = true;
        toast.error('Descrição deve ter entre 3 e 255 caracteres');
      }
    }

    if (!payments || payments.length < 1 || payments.length > 12) {
      formErrors = true;
      toast.error('Inclua entre 1 e 12 Pagamentos');
    }

    if (!formErrors) {
      setLoading(true);
      const newJob: NewJob = {
        name, types, customer, description, payments,
      };
      const result = await createJob(newJob);
      setLoading(false);
      if (result) {
        toast.success('Job cadastrado com sucesso');
        cleanForm();
        history.push('/jobs');
      }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const foundCustomers = await getCustomers({});
      setCustomers(foundCustomers);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <section className="main-section">
        <div className="card card-light">
          <div className={styles.main_card}>
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title="Novo Job"
          subtitle="Cadastre um novo Job"
          addButton={false}
        />

        <div className="two-col-form">

          <div className={`card card-white ${styles.card_white}`}>

            <form className="form-inline">

              <label htmlFor="name">
                <span>Nome do Job</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Nome do Job"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label htmlFor="customer">
                <span>Cliente</span>
                <select
                  name="customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option value="" disabled>Selecione o Cliente</option>

                  {customers && customers?.length > 0 ? (

                    customers?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  ) : <></>}

                </select>
              </label>

              <label htmlFor="types">
                <span>Tipos</span>
                <select
                  className="multi-select"
                  name="types"
                  multiple
                  value={types}
                // eslint-disable-next-line
                onChange={(e) => setTypes(Array.from(e.target.selectedOptions, (option) => option.value))}
                >
                  <option value="" disabled>Tipos</option>
                  <option value="VISUAL_IDENTITY">Identidade Visual</option>
                  <option value="BRAND_DESIGN">Design de Marca</option>
                  <option value="PACKAGING_DESIGN">Design de Embalagem</option>
                  <option value="NAMING">Naming</option>
                  <option value="OTHERS">Outros</option>
                </select>
              </label>
              <small className="small-form">* Segura CTRL para selecionar mais de um Tipo</small>

              <label htmlFor="description">
                <span>Descrição</span>
                <textarea
                  name="description"
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

            </form>

          </div>

          <div className={`card card-white ${styles.card_white}`}>

            <p className="payment-form-title">Pagamento</p>
            <div className="parcelas">

              <div className="flex">

                <label htmlFor="parcela_valor">
                  Valor parcela
                  <input
                    type="number"
                    name="parcela_valor"
                    placeholder="Valor parcela"
                    value={paymentValue}
                    onChange={(e) => setPaymentValue(e.target.value)}
                  />
                </label>

                <label htmlFor="parcela_vencimento">
                  Vencimento parcela
                  <input
                    type="date"
                    name="parcela_vencimento"
                    value={paymentDueDate}
                    onChange={(e) => setPaymentDueDate(e.target.value)}
                  />
                </label>

                <button type="button" onClick={() => handleAddPayment()}>+Add</button>

              </div>

              {payments.length > 0 && (
                <table className="job-values-list" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Parcela</th>
                      <th>Vencimento</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>

                    {payments.map((payment, index) => (

                      <tr key={payment.dueDate}>
                        <td>{`Parcela ${index + 1}`}</td>
                        <td>{new Date(payment.dueDate).toLocaleString('pt-BR', { timeZone: 'Europe/London', dateStyle: 'short' })}</td>
                        <td>{`R$ ${payment.value.toFixed(2).replace('.', ',')}`}</td>
                      </tr>

                    ))}

                  </tbody>
                </table>
              )}

            </div>

            <div className="bottom">

              <div className="value">
                <img src="/images/happy_money.png" alt="Valor total" />
                <span>
                  <i>Total:</i>
                  {`R$ ${sumBy(payments, 'value')}`}
                </span>
              </div>
              <button
                type="button"
                className="clean-btn"
                onClick={() => cleanPayments()}
              >
                Limpar
              </button>
              <button
                type="button"
                className="create-btn"
                onClick={() => handleCreateJob()}
              >
                Criar Job
              </button>

            </div>

          </div>

        </div>

      </div>
      <Footer />
    </section>
  );
};
