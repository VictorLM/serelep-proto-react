import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteJob, getJobs } from '../../api/jobs';
import { BasicFilters } from '../../types/filters.type';
import { Job, JobStatus, JobTypes } from '../../types/job.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

type JobsSelectFilters = BasicFilters & {
  status: JobStatus | 'ALL';
  types: JobTypes | 'ALL'; // TODO
}

export const Jobs: React.FC = (): ReactElement => {
  const [jobs, setJobs] = useState<Job[]>();
  const [loading, setLoading] = useState(true);
  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [filters, setFilters] = useState<JobsSelectFilters>({
    search: '',
    orderBy: 'DESC',
    status: 'ALL',
    types: 'ALL',
  });

  function cleanFilters(): void {
    setSearchFilter('');
    setFilters({
      search: '',
      orderBy: 'DESC',
      status: 'ALL',
      types: 'ALL',
    });
  }

  async function getInitialProps(): Promise<void> {
    setLoading(true);
    cleanFilters();
    const foundJobs = await getJobs({});
    setJobs(foundJobs);
    setLoading(false);
  }

  async function getJobsWithFilters(): Promise<void> {
    // VALIDANDO FORM
    if (filters.search) {
      if (filters.search.length < 1 || filters.search.length > 50) {
        toast.error('Pesquisa inválida');
        return;
      }
    }

    if (filters.orderBy !== 'ASC' && filters.orderBy !== 'DESC') {
      toast.error('Ordenar inválido');
      return;
    }

    if (filters.status !== 'OPEN' && filters.status !== 'DONE' && filters.status !== 'ALL') {
      toast.error('Status inválido');
      return;
    }

    const query = {
      ...filters,
      search: searchFilter,
    };

    setLoading(true);
    const foundJobs = await getJobs(query);
    setJobs(foundJobs);
    setLoading(false);
  }

  async function handleDelete(id: string): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Job?');
    if (confirmation) {
      await deleteJob(id);
      toast.success('Cliente excluído com sucesso');
      await getInitialProps();
    }
  }

  function handleSetFilters(key: string, value: string): void {
    setFilters(
      {
        ...filters,
        [key]: value,
      },
    );
  }

  function setTypePill(type: string): JSX.Element {
    switch (type) {
      case 'VISUAL_IDENTITY':
        return <span key={type} className="job-type-pill job-type-pill-sm">IDV</span>;
      case 'BRAND_DESIGN':
        return <span key={type} className="job-type-pill job-type-pill-sm">Marca</span>;
      case 'PACKAGING_DESIGN':
        return <span key={type} className="job-type-pill job-type-pill-sm">Embalagem</span>;
      case 'NAMING':
        return <span key={type} className="job-type-pill job-type-pill-sm">Naming</span>;
      case 'OTHERS':
        return <span key={type} className="job-type-pill job-type-pill-sm">Outros</span>;
      default:
        return <span key={type} className="job-type-pill job-type-pill-sm" />;
    }
  }

  useEffect(() => {
    (async () => {
      await getInitialProps();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      await getJobsWithFilters();
    })();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title="Jobs"
          subtitle="Aqui estão todos os seus jobs cadastrados"
          addButton
        />

        {loading ? <Loader />
          : (
            <div>

              <div className="filters">

                <select
                  name="orderby"
                  value={filters.orderBy}
                  onChange={(e) => handleSetFilters('orderBy', e.target.value)}
                >
                  <option disabled>Ordenar</option>
                  <option value="DESC">Mais novos</option>
                  <option value="ASC">Mais antigos</option>
                </select>

                <select
                  name="status"
                  value={filters.status}
                  onChange={(e) => handleSetFilters('status', e.target.value)}
                >
                  <option disabled>Status</option>
                  <option value="ALL">Todos</option>
                  <option value="OPEN">Abertos</option>
                  <option value="DONE">Concluídos</option>
                </select>
                <form>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Nome do Job"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <button type="button" className="search-btn" onClick={() => handleSetFilters('search', searchFilter)}>
                    <img src="/images/search.png" alt="Pesquisar" />
                  </button>
                  <button type="button" className="update-btn" onClick={() => getInitialProps()}>
                    <img src="/images/update.png" alt="Atualizar" />
                  </button>
                </form>

              </div>

              <table className="model-list" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Cliente</th>
                    <th>Preço (R$)</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>

                  {jobs && jobs?.length > 0 ? (

                    jobs?.map((job) => (

                      <tr key={job.id}>
                        <td className="link-view">
                          <Link to={`/jobs/${job.id}`}>
                            {job.name}
                          </Link>
                        </td>
                        <td>
                          {job.types.map((type) => (
                            setTypePill(type)
                          ))}
                        </td>
                        <td>
                          {job.status === 'DONE' ? (
                            <span className="green">&#11044;</span>
                          ) : (
                            <span className="yellow">&#11044;</span>
                          )}
                        </td>
                        <td>{job.customer}</td>
                        <td>{`${job.price.toFixed(2).replace('.', ',')}`}</td>
                        <td>{job.createdAt.toLocaleString('pt-BR', { dateStyle: 'short' })}</td>
                        <td>
                          <Link to={`/jobs/${job.id}/editar`}>
                            <img src="/images/edit.png" alt="Editar" />
                          </Link>
                          <button type="button" className="delete-btn" onClick={() => handleDelete(job.id)}>
                            <img src="/images/delete.png" alt="Excluir" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={5}>
                        <h2>Nenhum job encontrado</h2>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>
          )}

      </div>
      <Footer />
    </section>
  );
};
