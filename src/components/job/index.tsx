import React, {
  ReactElement, SyntheticEvent, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { sumBy } from 'lodash';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';
import { FullJob, JobNote } from '../../types/job.type';
import { createJobNote, deleteJob, getJobByID } from '../../api/jobs';
import { JobValueCard } from '../job-value-card';

type CustomerParams = {
  id: string;
};

export const SingleJob: React.FC = (): ReactElement => {
  const [job, setJob] = useState<FullJob>();
  const [jobNotes, setJobNotes] = useState<JobNote[]>();
  const [newJobNote, setNewJobNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const { id } = useParams<CustomerParams>();

  function cleanForm(): void {
    setNewJobNote('');
  }

  async function handleCreateJobNote(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    // VALIDANDO FORM
    let formErrors = false;
    if (newJobNote.length < 3 || newJobNote.length > 255) {
      formErrors = true;
      toast.error('Anotação devem ter entre 3 e 255 caracteres');
    }

    if (!formErrors) {
      setLoadingNotes(true);
      const result = await createJobNote(id, newJobNote);
      if (result) {
        toast.success('Anotação cadastrada com sucesso');
        cleanForm();
        const newNote: JobNote = {
          note: newJobNote,
          createdAt: new Date(Date.now()),
        };
        const tempJobNotes: JobNote[] = (jobNotes && Array.isArray(jobNotes)) ? [...jobNotes] : [];
        tempJobNotes.push(newNote);
        setJobNotes(tempJobNotes);
      }
      setLoadingNotes(false);
    }
  }

  async function handleDelete(): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Job?');
    if (confirmation) {
      await deleteJob(id);
      toast.success('Cliente excluído com sucesso');
      history.push('/jobs');
    }
  }

  function setTypePill(type: string): JSX.Element {
    switch (type) {
      case 'VISUAL_IDENTITY':
        return <span key={type} className="job-type-pill job-type-pill-gr">IDV</span>;
      case 'BRAND_DESIGN':
        return <span key={type} className="job-type-pill job-type-pill-gr">Marca</span>;
      case 'PACKAGING_DESIGN':
        return <span key={type} className="job-type-pill job-type-pill-gr">Embalagem</span>;
      case 'NAMING':
        return <span key={type} className="job-type-pill job-type-pill-gr">Naming</span>;
      case 'OTHERS':
        return <span key={type} className="job-type-pill job-type-pill-gr">Outros</span>;
      default:
        return <span key={type} className="job-type-pill job-type-pill-gr" />;
    }
  }

  function setSubTypePill(type: string): JSX.Element {
    switch (type) {
      case 'MAINTENACE':
        return <span key={type} className="job-type-pill job-type-pill-gr">Manutenção</span>;
      case 'PURCHASES':
        return <span key={type} className="job-type-pill job-type-pill-gr">Compras</span>;
      case 'THIRD_PARTY_SERVICES':
        return <span key={type} className="job-type-pill job-type-pill-gr">Terceiros</span>;
      case 'TOOLS':
        return <span key={type} className="job-type-pill job-type-pill-gr">Ferramentas</span>;
      case 'ESSENTIAL_SERVICES':
        return <span key={type} className="job-type-pill job-type-pill-gr">Serviços Essenciais</span>;
      case 'TAXES':
        return <span key={type} className="job-type-pill job-type-pill-gr">Impostos</span>;
      case 'FEES':
        return <span key={type} className="job-type-pill job-type-pill-gr">Taxas</span>;
      case 'OTHERS':
        return <span key={type} className="job-type-pill job-type-pill-gr">Outros</span>;
      default:
        return <span key={type} className="job-type-pill job-type-pill-gr" />;
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
        setJob(foundJob);
        setJobNotes(foundJob.notes);
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
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title={job?.name || ''}
          subtitle="Aqui estão todas as informações deste Job"
          addButton={false}
        />

        <div className={styles.main_card}>

          <div className={`card card-white ${styles.info_card}`}>

            <table className="single-model-list" cellSpacing="10">
              <tbody>
                <tr>
                  <td>Tipo:</td>
                  <td className="info">
                    {job?.types.map((type) => (
                      setTypePill(type)
                    ))}
                  </td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td className="info">
                    {job?.status === 'DONE' ? (
                      <span className="green">&#11044; Concluído</span>
                    ) : (
                      <span className="yellow">&#11044; Em execução</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Cliente:</td>
                  <td className="info link-view">
                    <Link to={`/clientes/${job?.customer.id}`}>
                      {job?.customer.name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Criado em:</td>
                  <td className="info">{job?.createdAt.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>ID:</td>
                  <td className="info">{job?.id}</td>
                </tr>
                {job?.description && (
                <>
                  <tr>
                    <td colSpan={2}>Descrição:</td>
                  </tr>
                  <tr>
                    <td className="info" colSpan={2}>{job?.description}</td>
                  </tr>
                </>
                )}
              </tbody>
            </table>

            <div className="single-model-actions">
              <Link to={`/jobs/${job?.id}/editar`}>
                <button className="edit-btn-gr" type="button">
                  <img src="/images/edit.png" alt="Editar" />
                  Editar
                </button>
              </Link>
              <button type="button" className="delete-btn-gr" onClick={() => handleDelete()}>
                <img src="/images/delete.png" alt="Excluir" />
                Excluir
              </button>
            </div>

          </div>

          <div className={styles.values}>
            <div className={styles.row}>

              <JobValueCard
                type="payment"
                value={sumBy(job?.payments, 'value')}
              />

              <JobValueCard
                type="portion"
                value={sumBy(job?.payments, 'value') / (job?.payments.length || 1)}
                times={job?.payments.length}
              />

            </div>
            <div className={styles.row}>

              <JobValueCard
                type="bills"
                value={sumBy(job?.bills, 'value')}
              />

              <JobValueCard
                type="profit"
                value={Number(sumBy(job?.payments, 'value')) - Number(sumBy(job?.bills, 'value'))}
              />

            </div>

          </div>

        </div>

        <div className={styles.main_card}>

          <div className={`card card-white ${styles.info_card}`} style={{ height: 'fit-content' }}>
            <h3>Anotações</h3>

            {loadingNotes ? <Loader />
              : (
                <>
                  {jobNotes && jobNotes.length > 0 ? (

                    jobNotes.map((jobNote) => (
                      <div key={jobNote.createdAt.toISOString()} className={`card card-light ${styles.note_card}`}>
                        {jobNote.note}
                        <small>
                          {` - ${jobNote.createdAt.toLocaleString('pt-BR', { dateStyle: 'short' })}`}
                        </small>
                      </div>

                    ))
                  ) : (
                    <p className={styles.not_found}>Nenhuma anotação registrada</p>
                  )}

                  <form className={styles.notes_form} onSubmit={(e) => handleCreateJobNote(e)}>
                    <textarea
                      name="note"
                      id="note"
                      value={newJobNote}
                      onChange={(e) => setNewJobNote(e.target.value)}
                      placeholder="Nova anotação..."
                    />
                    <button type="submit">
                      <img src="/images/send.png" alt="Enviar" />
                    </button>
                  </form>
                </>

              )}

          </div>

          <div className={`card ${styles.payments_bills_card}`}>

            <div className={`card card-white ${styles.info_card}`}>
              <h3>Pagamentos</h3>

              <table className="job-values-list" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Parcela</th>
                    <th>Vencimento</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>

                  {job?.payments && job?.payments.length > 0 ? (

                    job?.payments.map((payment, index) => (

                      <tr key={payment.id}>
                        <td className="info link-view">
                          <Link to={`/pagamentos/${payment.id}`}>
                            {`Parcela ${index + 1}`}
                          </Link>
                        </td>
                        <td>{payment.dueDate.toLocaleString('pt-BR', { timeZone: 'Europe/London', dateStyle: 'short' })}</td>
                        <td>{`R$ ${payment.value.toFixed(2).replace('.', ',')}`}</td>
                        <td>
                          {payment.payed ? (
                            <span className="green">&#11044;</span>
                          ) : (
                            <span className="yellow">&#11044;</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={5}>
                        <h3>Nenhum pagamento registrado</h3>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>

            <div className={`card card-white ${styles.info_card}`}>
              <h3>Custos</h3>

              <table className="job-values-list" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>

                  {job?.bills && job?.bills.length > 0 ? (

                    job?.bills.map((bill) => (

                      <tr key={bill.id}>
                        <td className="info link-view">
                          <Link to={`/despesas/${bill.id}`}>
                            {bill.name}
                          </Link>
                        </td>
                        <td>{setSubTypePill(bill.subType)}</td>
                        <td>{`R$ ${bill.value.toFixed(2).replace('.', ',')}`}</td>
                        <td>
                          {bill.payed ? (
                            <span className="green">&#11044;</span>
                          ) : (
                            <span className="yellow">&#11044;</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={5}>
                        <h3>Nenhum custo registrado</h3>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>

          </div>

        </div>

      </div>
      <Footer />
    </section>
  );
};
