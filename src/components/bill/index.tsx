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
import { FullBill } from '../../types/bill.type';
import { deleteBill, getBillByID } from '../../api/bills';

type BillParams = {
  id: string;
};

export const SingleBill: React.FC = (): ReactElement => {
  const [bill, setBill] = useState<FullBill>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<BillParams>();

  async function handleDelete(): Promise<void> {
    // eslint-disable-next-line
    const confirmation = window.confirm('Deseja realmente excluir esta Despesa?');
    if (confirmation) {
      await deleteBill(id);
      toast.success('Despesa excluída com sucesso');
      history.push('/despesas');
    }
  }

  function setBillStatus(singleBill: FullBill | undefined): JSX.Element | null {
    if (singleBill) {
      if (singleBill.type === 'FIXED') {
        return <span className="gray">&#11044; Despesa Fixa</span>;
      }

      if (singleBill.payed) {
        return <span className="green">&#11044; Pago</span>;
      }

      return <span className="yellow">&#11044; Em aberto</span>;
    }
    return null;
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
      setLoading(true);

      if (!id) return;
      const foundBill = await getBillByID(id);

      if (!foundBill) {
        toast.error('Erro ao carregar as informações da Despesa');
        setLoading(false);
        history.push('/despesas');
      } else {
        setBill(foundBill);
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <section className={`main-section ${styles.section}`}>
      <div className="card card-light">

        <TopBar
          title={bill?.name || ''}
          subtitle="Aqui estão todas as informações desta Despesa"
          addButton={false}
        />

        <div className="card card-white w-50">

          {loading ? <Loader />
            : (
              <>
                <table className="single-model-list" cellSpacing="10">
                  <tbody>
                    <tr>
                      <td>Tipo:</td>
                      <td className="info">{setSubTypePill(bill?.subType || '')}</td>
                    </tr>
                    {bill?.job && (
                      <tr>
                        <td>Job:</td>
                        <td className="info link-view">
                          <Link to={`/jobs/${bill?.job?.id}`}>
                            {bill?.job?.name}
                          </Link>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>Valor:</td>
                      <td className="info">{`R$ ${bill?.value.toFixed(2).replace('.', ',')}`}</td>
                    </tr>
                    <tr>
                      <td>Vencimento:</td>
                      <td className="info">
                        {bill?.dueDate ? (
                          bill.dueDate.toLocaleString('pt-BR', { timeZone: 'Europe/London', dateStyle: 'short' })
                        ) : (
                          setTypePill(bill?.type || '')
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td className="info">{setBillStatus(bill)}</td>
                    </tr>
                    <tr>
                      <td>Criado em:</td>
                      <td className="info">{bill?.createdAt.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>ID:</td>
                      <td className="info">{bill?.id}</td>
                    </tr>
                    {bill?.notes && (
                    <>
                      <tr>
                        <td colSpan={2}>Anotações:</td>
                      </tr>
                      <tr>
                        <td className="info" colSpan={2}>{bill?.notes}</td>
                      </tr>
                    </>
                    )}
                  </tbody>
                </table>

                <div className="single-model-actions">
                  <Link to={`/despesas/${bill?.id}/editar`}>
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
