import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deletePayment, getPayments } from '../../api/payments';
import { BasicFilters } from '../../types/filters.type';
import { Payment } from '../../types/payment.type';
import { Loader } from '../loader';
import { Footer } from '../template/footer';
import { TopBar } from '../template/top-bar';

type PaymentsSelectFilters = BasicFilters & {
  status: 'PAYED' | 'OVERDUE' | 'ALL';
}

export const Payments: React.FC = (): ReactElement => {
  const [payments, setPayments] = useState<Payment[]>();
  const [loading, setLoading] = useState(true);
  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [filters, setFilters] = useState<PaymentsSelectFilters>({
    search: '',
    orderBy: 'DESC',
    status: 'ALL',
  });

  function cleanFilters(): void {
    setSearchFilter('');
    setFilters({
      search: '',
      orderBy: 'DESC',
      status: 'ALL',
    });
  }

  async function getInitialProps(): Promise<void> {
    setLoading(true);
    cleanFilters();
    const foundPayments = await getPayments({});
    setPayments(foundPayments);
    setLoading(false);
  }

  async function getPaymentsWithFilters(): Promise<void> {
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

    const query = {
      orderBy: filters.orderBy,
      search: searchFilter,
      overdue: filters.status === 'OVERDUE' ? 'TRUE' : null,
      payed: filters.status === 'PAYED' ? 'TRUE' : null,
    };

    setLoading(true);
    const foundPayments = await getPayments(query);
    setPayments(foundPayments);
    setLoading(false);
  }

  async function handleDelete(id: string): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir este Pagamento?');
    if (confirmation) {
      await deletePayment(id);
      toast.success('Pagamento excluído com sucesso');
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

  useEffect(() => {
    (async () => {
      await getInitialProps();
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      await getPaymentsWithFilters();
    })();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <section className="main-section">
      <div className="card card-light">

        <TopBar
          title="Pagamentos"
          subtitle="Aqui estão todos os seus pagamentos cadastrados"
          addButton={false}
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
                  <option value="OVERDUE">Vencidos</option>
                  <option value="PAYED">Pagos</option>
                </select>

                <form>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Notas do Pagamento"
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
                    <th>ID</th>
                    <th>Job</th>
                    <th>Valor (R$)</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>

                  {payments && payments?.length > 0 ? (

                    payments?.map((payment) => (

                      <tr key={payment.id}>
                        <td className="link-view">
                          <Link to={`/pagamentos/${payment.id}`}>
                            {payment.id}
                          </Link>
                        </td>
                        <td>{payment.job}</td>
                        <td>{`${payment.value.toFixed(2).replace('.', ',')}`}</td>
                        <td>{payment.dueDate.toLocaleString('pt-BR', { timeZone: 'Europe/London', dateStyle: 'short' })}</td>
                        <td>
                          {payment.payed ? (
                            <span className="green">&#11044;</span>
                          ) : (
                            <span className="yellow">&#11044;</span>
                          )}
                        </td>
                        <td>
                          <Link to={`/pagamentos/${payment.id}/editar`}>
                            <img src="/images/edit.png" alt="Editar" />
                          </Link>
                          <button type="button" className="delete-btn" onClick={() => handleDelete(payment.id)}>
                            <img src="/images/delete.png" alt="Excluir" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found-results">
                      <td colSpan={6}>
                        <h2>Nenhum pagamento encontrado</h2>
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
