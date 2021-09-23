import React, {
  ReactElement, SyntheticEvent, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';
import { UpdateJob } from '../../types/job.type';
import { getJobByID, updateJob } from '../../api/jobs';
import { Customer } from '../../types/customer.type';
import { getCustomers } from '../../api/customer';

type EditJobParams = {
  id: string;
};

export const EditJobForm: React.FC = (): ReactElement => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [types, setTypes] = useState(['']);
  const [customer, setCustomer] = useState('');
  const [description, setDescription] = useState('');
  const [customers, setCustomers] = useState<Customer[]>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<EditJobParams>();

  async function handleEditJob(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
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

    if (status !== 'OPEN' && status !== 'DONE') {
      formErrors = true;
      toast.error('Status inválido');
    }

    if (!formErrors) {
      setLoading(true);
      const updatedJob: UpdateJob = {
        name, status, types, customer, description,
      };
      const result = await updateJob(id, updatedJob);
      setLoading(false);
      if (result) {
        toast.success('Job editado com sucesso');
        history.push('/jobs');
      }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundJob = await getJobByID(id);

      if (!foundJob) {
        toast.error('Erro ao carregar as informações do Job');
        setLoading(false);
        history.push('/jobs');
      } else {
        const foundCustomers = await getCustomers({});
        setCustomers(foundCustomers);

        setName(foundJob.name);
        setStatus(foundJob.status);
        setTypes(foundJob.types);
        setCustomer(foundJob.customer.id);
        setDescription(foundJob.description || '');
        setLoading(false);
      }
    })();
  }, [id]);

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
          title="Editar Job"
          subtitle="Edite as informações deste Job"
          addButton={false}
        />

        <div className={`card card-white w-50 ${styles.card_white}`}>

          <form className="form-inline" onSubmit={(e) => handleEditJob(e)}>
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

            <label htmlFor="status">
              <span>Status</span>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>Selecione o Status</option>
                <option value="OPEN">Em Execução</option>
                <option value="DONE">Concluído</option>
              </select>
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

            <button type="submit" className="create-btn">
              Editar Job
            </button>

          </form>

        </div>

      </div>
      <Footer />
    </section>
  );
};
