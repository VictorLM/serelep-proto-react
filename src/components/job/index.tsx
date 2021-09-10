import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import history from '../../history/history';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

import styles from './styles.module.scss';
import { FullJob } from '../../types/job.type';
import { deleteJob, getJobByID } from '../../api/jobs';

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

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (!id) return;
      const foundJob = await getJobByID(id);
      console.log(foundJob);

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
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title={job?.name || ''}
          subtitle="Aqui estão todas as informações deste Job"
          addButton={false}
        />

        <div className="card card-white w-50">

          {loading ? <Loader />
            : (
              <>
                <table className="single-model-list" cellSpacing="10">
                  <tbody>
                    <tr>
                      <td>CPF / CNPJ:</td>
                      <td className="info">{job?.name}</td>
                    </tr>
                    <tr>
                      <td>Responsável:</td>
                      <td className="info">{job?.name}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td className="info">{job?.name}</td>
                    </tr>
                    <tr>
                      <td>Criado em:</td>
                      <td className="info">{job?.createdAt.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>ID:</td>
                      <td className="info">{job?.name}</td>
                    </tr>
                    {job?.notes && (
                    <>
                      <tr>
                        <td colSpan={2}>Anotações:</td>
                      </tr>
                      <tr>
                        <td className="info" colSpan={2}>{job?.notes}</td>
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

      </div>
      <Footer />
    </section>
  );
};
