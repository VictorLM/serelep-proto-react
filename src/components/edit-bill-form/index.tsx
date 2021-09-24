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
import { UpdateBill } from '../../types/bill.type';
import { getBillByID, updateBill } from '../../api/bills';
import { Job } from '../../types/job.type';
import { getJobs } from '../../api/jobs';

type EditBillParams = {
  id: string;
};

export const EditBillForm: React.FC = (): ReactElement => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [payed, setPayed] = useState('');
  const [job, setJob] = useState('');
  const [notes, setNotes] = useState('');
  const [jobs, setJobs] = useState<Job[]>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<EditBillParams>();

  function cleanForm(): void {
    setName('');
    setType('');
    setSubType('');
    setValue('');
    setDueDate('');
    setPayed('');
    setJob('');
    setNotes('');
  }

  async function handleUpdateBill(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    let formErrors = false;
    if (notes) {
      if (notes.length < 3 || notes.length > 255) {
        formErrors = true;
        toast.error('Anotações devem ter entre 3 e 255 caracteres');
      }
    }

    if (type === 'VARIABLE') {
      if (!isDate(dueDate)) {
        formErrors = true;
        toast.error('Data do vencimento inválida');
        return;
      }
    }

    if (payed) {
      if (!isDate(payed)) {
        formErrors = true;
        toast.error('Data do pagamento inválida');
        return;
      }
    }

    if (Number.isNaN(value) || Math.sign(Number(value)) === -1) {
      formErrors = true;
      toast.error('Valor inválido');
      return;
    }

    if (!type) {
      formErrors = true;
      toast.error('Tipo inválido');
      return;
    }

    if (!subType) {
      formErrors = true;
      toast.error('Subtipo inválido');
      return;
    }

    // TODO - CHECAGEM VALIDAÇÃO TYPE, SUBTYPE, JOB

    if (!formErrors) {
      setLoading(true);
      const updatedBill: UpdateBill = {
        name, type, subType, value: Number(value), notes,
      };

      if (job && type === 'VARIABLE') updatedBill.job = job;
      if (type === 'VARIABLE') updatedBill.dueDate = dueDate;
      if (payed) updatedBill.payed = payed;

      const result = await updateBill(id, updatedBill);

      setLoading(false);
      if (result) {
        toast.success('Despesa editada com sucesso');
        cleanForm();
        history.push(`/despesas/${id}`);
      }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundBill = await getBillByID(id);

      if (!foundBill) {
        toast.error('Erro ao carregar as informações da Despesa');
        setLoading(false);
        history.push('/despesas');
      } else {
        setName(foundBill.name);
        setType(foundBill.type);
        setSubType(foundBill.subType);
        setValue(String(foundBill.value));
        if (foundBill.dueDate) setDueDate(foundBill.dueDate.toISOString().substr(0, 10));
        if (foundBill.payed) setPayed(foundBill.payed.toISOString().substr(0, 10));
        if (foundBill.job) setJob(foundBill.job.id);
        setNotes(foundBill.notes || '');

        const foundJobs = await getJobs({});
        setJobs(foundJobs);
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

              <form className="form-inline" onSubmit={(e) => handleUpdateBill(e)}>

                <label htmlFor="name">
                  <span>Nome</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label htmlFor="type">
                  <span>Tipo</span>
                  <select
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" disabled>Selecione o Tipo</option>
                    <option value="FIXED">Fixa</option>
                    <option value="VARIABLE">Variável</option>
                  </select>
                </label>

                <label htmlFor="subType">
                  <span>Subtipo</span>
                  <select
                    name="subType"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                  >
                    <option value="" disabled>Selecione o Subtipo</option>
                    <option value="THIRD_PARTY_SERVICES">Terceiros</option>
                    <option value="PURCHASES">Compras</option>
                    <option value="MAINTENACE">Manutenção</option>
                    <option value="TOOLS">Ferramentas</option>
                    <option value="ESSENTIAL_SERVICES">Serv. essenciais</option>
                    <option value="TAXES">Impostos</option>
                    <option value="FEES">Taxas</option>
                    <option value="OTHERS">Outras</option>
                  </select>
                </label>

                <label htmlFor="value">
                  <span>Valor (R$)</span>
                  <input
                    type="number"
                    name="value"
                    placeholder="Valor"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </label>

                {type !== 'FIXED' && (
                  <>
                    <label htmlFor="job">
                      <span>Job</span>
                      <select
                        name="job"
                        value={job}
                        onChange={(e) => setJob(e.target.value)}
                      >
                        <option value="" disabled>Selecione o Job</option>

                        {jobs && jobs?.length > 0 ? (

                          jobs.map((j) => (
                            <option key={j.id} value={j.id}>{j.name}</option>
                          ))
                        ) : <></>}
                      </select>
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
                  </>
                )}

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
