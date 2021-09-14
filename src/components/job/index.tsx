import React, {
  ReactElement, useEffect, useState,
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
import { FullJob } from '../../types/job.type';
import { deleteJob, getJobByID } from '../../api/jobs';
import { JobValueCard } from '../job-value-card';

type CustomerParams = {
  id: string;
};

export const SingleJob: React.FC = (): ReactElement => {
  const [job, setJob] = useState<FullJob>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<CustomerParams>();

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

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundJob = await getJobByID(id);
      // console.log(foundJob);

      if (!foundJob) {
        toast.error('Erro ao carregar as informações do Job');
        setLoading(false);
        history.push('/jobs');
      } else {
        setJob(foundJob);
        setLoading(false);
      }
    })();
  }, [id]);

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

            {loading ? <Loader />
              : (
                <>
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
                        <td className="info">{job?.createdAt.toLocaleString('pt-BR', { dateStyle: 'short' })}</td>
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

                </>
              )}

          </div>

          <div className={styles.values}>
            <div className={styles.row}>

              <JobValueCard
                type="payment"
                value={sumBy(job?.payments, 'value')}
              />

              <JobValueCard
                type="portion"
                value={job?.payments[0].value}
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

          <div className={`card card-white ${styles.info_card}`}>
            Notas
          </div>

          <div className={`card card-white ${styles.info_card}`}>
            Teste
          </div>

        </div>

      </div>
      <Footer />
    </section>
  );
};
