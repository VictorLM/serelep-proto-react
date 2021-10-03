import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteBill, getBills } from '../../api/bills';
import { Bill } from '../../types/bill.type';
import { BasicFilters } from '../../types/filters.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

type BillsSelectFilters = BasicFilters & {
  status: 'PAYED' | 'OVERDUE' | 'ALL';
  type: string;
  subType: string;
}

export const Bills: React.FC = (): ReactElement => {
  const [bills, setBills] = useState<Bill[]>();
  const [loading, setLoading] = useState(true);
  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [filters, setFilters] = useState<BillsSelectFilters>({
    search: '',
    orderBy: 'DESC',
    status: 'ALL',
    type: '',
    subType: '',
  });

  function cleanFilters(): void {
    setSearchFilter('');
    setFilters({
      search: '',
      orderBy: 'DESC',
      status: 'ALL',
      type: '',
      subType: '',
    });
  }

  async function getInitialProps(): Promise<void> {
    setLoading(true);
    cleanFilters();
    const foundBills = await getBills({});
    setBills(foundBills);
    setLoading(false);
  }

  async function getBillsWithFilters(): Promise<void> {
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

    if (filters.status !== 'ALL' && filters.status !== 'OVERDUE' && filters.status !== 'PAYED') {
      toast.error('Status inválido');
      return;
    }

    // TODO - CHECAGEM VALIDAÇÃO TIPO E SUBTIPO

    const query = {
      orderBy: filters.orderBy,
      search: searchFilter,
      overdue: filters.status === 'OVERDUE' ? 'TRUE' : null,
      payed: filters.status === 'PAYED' ? 'TRUE' : null,
      type: filters.type,
      subType: filters.subType,
    };

    setLoading(true);
    const foundBills = await getBills(query);
    setBills(foundBills);
    setLoading(false);
  }

  async function handleDelete(id: string): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir esta Despesa?');
    if (confirmation) {
      await deleteBill(id);
      toast.success('Despesa excluída com sucesso');
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

  function setBillStatus(bill: Bill): JSX.Element {
    if (bill.type === 'FIXED') {
      return <span className="gray">&#11044;</span>;
    }

    if (bill.payed) {
      return <span className="green">&#11044;</span>;
    }

    return <span className="yellow">&#11044;</span>;
  }

  function setTypePill(type: string): JSX.Element {
    switch (type) {
      case 'FIXED':
        return <span key={type} className="job-type-pill job-type-pill-gr">Despesa Fixa</span>;
      case 'VARIABLE':
        return <span key={type} className="job-type-pill job-type-pill-gr">Variável</span>;
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
        return <span key={type} className="job-type-pill job-type-pill-gr">Serv. Essenciais</span>;
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
      await getInitialProps();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      await getBillsWithFilters();
    })();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title="Despesas"
          subtitle="Aqui estão todos as suas despesas cadastradas"
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
                  <option value="DESC">Mais novas</option>
                  <option value="ASC">Mais antigas</option>
                </select>

                <select
                  name="status"
                  value={filters.status}
                  onChange={(e) => handleSetFilters('status', e.target.value)}
                >
                  <option disabled>Status</option>
                  <option value="ALL">Todas</option>
                  <option value="OVERDUE">Vencidas</option>
                  <option value="PAYED">Pagas</option>
                </select>

                <select
                  name="type"
                  value={filters.type}
                  onChange={(e) => handleSetFilters('type', e.target.value)}
                >
                  <option disabled>Tipo</option>
                  <option value="">Todas</option>
                  <option value="FIXED">Fixas</option>
                  <option value="VARIABLE">Variáveis</option>
                </select>

                <select
                  name="subType"
                  value={filters.subType}
                  onChange={(e) => handleSetFilters('subType', e.target.value)}
                >
                  <option disabled>Subtipo</option>
                  <option value="">Todas</option>
                  <option value="THIRD_PARTY_SERVICES">Terceiros</option>
                  <option value="PURCHASES">Compras</option>
                  <option value="MAINTENACE">Manutenção</option>
                  <option value="TOOLS">Ferramentas</option>
                  <option value="ESSENTIAL_SERVICES">Serv. essenciais</option>
                  <option value="TAXES">Impostos</option>
                  <option value="FEES">Taxas</option>
                  <option value="OTHERS">Outras</option>
                </select>

                <form>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Nome da despesa"
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
                    <th>Subtipo</th>
                    <th>Valor (R$)</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>

                  {bills && bills?.length > 0 ? (

                    bills.map((bill) => (

                      <tr key={bill.id}>
                        <td className="link-view">
                          <Link to={`/despesas/${bill.id}`}>
                            {bill.name}
                          </Link>
                        </td>
                        <td>{setSubTypePill(bill.subType)}</td>
                        <td>{`${bill.value.toFixed(2).replace('.', ',')}`}</td>
                        <td>
                          {bill.dueDate ? (
                            bill.dueDate.toLocaleString('pt-BR', { timeZone: 'Europe/London', dateStyle: 'short' })
                          ) : (
                            setTypePill(bill.type)
                          )}
                        </td>
                        <td>{setBillStatus(bill)}</td>
                        <td>
                          <Link to={`/despesas/${bill.id}/editar`}>
                            <img src="/images/edit.png" alt="Editar" />
                          </Link>
                          <button type="button" className="delete-btn" onClick={() => handleDelete(bill.id)}>
                            <img src="/images/delete.png" alt="Excluir" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={6}>
                        <h2>Nenhuma despesa encontrada</h2>
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
